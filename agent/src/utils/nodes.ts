import { convertActionsToDynamicStructuredTools, copilotkitEmitState } from "@copilotkit/sdk-js/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { model } from "../config/llm";
import { tools } from "./tools";
import { AgentState } from "./state";
import { ToolNode } from "@langchain/langgraph/prebuilt";

export async function chat_node(state: AgentState, config: RunnableConfig) {
	console.log("\n🗣️  CHAT NODE CALLED");
	console.log("Messages count:", state.messages?.length || 0);
	console.log("Graph data exists:", !!state.graph_data);
	console.log("Nodes in graph:", state.graph_data?.nodes?.length || 0);

	if (!state.messages || state.messages.length === 0) {
		console.log("ℹ️  No messages to process, skipping chat node");
		return {};
	}

	const graphContext = buildGraphContext(state);

	const systemMessage = new SystemMessage({
		content: `You are a code dependency analyzer assistant.

${graphContext}

Your job:
- Answer questions about what files do (use the summaries above)
- Explain dependencies between files
- Provide insights about code architecture
- Suggest improvements

Use the graph data above to answer accurately.`,
	});

	const modelWithTools = model.bindTools([
		...convertActionsToDynamicStructuredTools(state.copilotkit?.actions ?? []),
		...tools,
	]);

	const response = await modelWithTools.invoke(
		[systemMessage, ...state.messages],
		config,
	);

	console.log("✅ Chat response generated");

	return {
		messages: [response],
	};
}

function buildGraphContext(state: AgentState): string {
	if (!state.graph_data || state.graph_data.nodes.length === 0) {
		return "No repository analysis available yet.";
	}

	let context = `## Repository Analysis\n\n`;
	context += `**Total Files Analyzed:** ${state.graph_data.nodes.length}\n`;
	context += `**Dependencies Found:** ${state.graph_data.edges.length}\n\n`;

	context += `### File Summaries:\n\n`;
	state.graph_data.nodes.forEach((node) => {
		context += `**${node.id}**\n`;
		context += `${node.summary}\n\n`;
	});

	if (state.graph_data.edges.length > 0) {
		context += `### Dependencies:\n\n`;
		state.graph_data.edges.forEach((edge) => {
			context += `- \`${edge.source}\` imports \`${edge.target}\`\n`;
		});
	}

	return context;
}

export async function analyze_files_node(state: AgentState, config: RunnableConfig) {
  console.log('\n🔍 ANALYZE FILES NODE CALLED');
  
  console.log('Files received:', state.files);
  await copilotkitEmitState(config, {
    ...state,
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "in-progress", message: `Analyzing ${state.files.length} files...` },
      { step: "build_graph", status: "pending", message: "Waiting..." }
    ]
  });

  const nodes = [];

  for (let i = 0; i < state.files.length; i++) {
    const file = state.files[i];
    console.log(`Analyzing file ${file.content}`);

    await copilotkitEmitState(config, {
      ...state,
      analysis_progress: [
        { step: "initialize", status: "completed", message: "Analysis started" },
        { step: "analyze_files", status: "in-progress", message: `Analyzing file ${i + 1}/${state.files.length}: ${file.path}` },
        { step: "build_graph", status: "pending", message: "Waiting..." }
      ]
    });

    try {
      const response = await model.invoke(
        `Summarize what this file does in 1-2 sentences:\n\nFile: ${file.path}\n\nCode:\n${file.content.slice(0, 1000)}`
      );
      
      nodes.push({
        id: file.path,
        summary: response.content as string
      });
    } catch (error) {
      console.error(`Error analyzing ${file.path}:`, error);
    }
  }

  await copilotkitEmitState(config, {
    ...state,
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "completed", message: `Analyzed ${nodes.length} files successfully` },
      { step: "build_graph", status: "pending", message: "Building dependency graph..." }
    ]
  });
  
  console.log(`File state to be sent: `, state.files);
  return { 
    files: state.files,
    graph_data: { nodes, edges: [] },
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "completed", message: `Analyzed ${nodes.length} files` },
      { step: "build_graph", status: "pending", message: "Building dependency graph..." }
    ]
  };
}

export async function build_edges_node(state: AgentState, config: RunnableConfig) {
  console.log('\n🔗 BUILD EDGES NODE CALLED');

  console.log('Files received:', state.files);
  
  if (state.files && state.files.length > 0) {
    console.log('First file:', {
      path: state.files[0].path,
      contentLength: state.files[0].content?.length || 0,
      hasContent: !!state.files[0].content
    });
  }  

  await copilotkitEmitState(config, {
    ...state,
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "completed", message: `Analyzed ${state.graph_data.nodes.length} files` },
      { step: "build_graph", status: "in-progress", message: "Extracting dependencies..." }
    ]
  });

  const edges = [];

  for (const file of state.files) {
    const importRegex = /import .* from ['"](.+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(file.content)) !== null) {
      if (match[1].startsWith('./') || match[1].startsWith('../')) {
        edges.push({
          source: file.path,
          target: match[1]
        });
      }
    }
  }

  await copilotkitEmitState(config, {
    ...state,
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "completed", message: `Analyzed ${state.graph_data.nodes.length} files` },
      { step: "build_graph", status: "completed", message: `Found ${edges.length} dependencies` }
    ]
  });

  return {
    files: state.files,
    graph_data: {
      nodes: state.graph_data.nodes,
      edges
    },
    analysis_progress: [
      { step: "initialize", status: "completed", message: "Analysis started" },
      { step: "analyze_files", status: "completed", message: `Analyzed ${state.graph_data.nodes.length} files` },
      { step: "build_graph", status: "completed", message: `Found ${edges.length} dependencies` }
    ]
  };
}

export const tool_node = new ToolNode(tools);