import { convertActionsToDynamicStructuredTools } from "@copilotkit/sdk-js/langgraph";
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

export async function analyze_files_node(state: AgentState) {
	console.log("\n🔍 ANALYZE FILES NODE CALLED");
	console.log("Files received:", state.files?.length || 0);

	if (!state.files || state.files.length === 0) {
		console.error("❌ No files to analyze!");
		return {
			graph_data: {
				nodes: [],
				edges: [],
			},
		};
	}

	console.log("Files to analyze:");
	state.files.slice(0, 10).forEach((f) => {
		console.log(`  - ${f.path} (${f.content.length} chars)`);
	});

	const nodes = [];

	for (const file of state.files.slice(0, 10)) {
		console.log(`\n📝 Analyzing: ${file.path}`);
		console.log(`Content preview: ${file.content.slice(0, 100)}...`);

		try {
			const response = await model.invoke(
				`Summarize what this file does in 1-2 sentences:\n\nFile: ${file.path}\n\nCode:\n${file.content.slice(0, 1000)}`,
			);

			const summary = response.content as string;
			console.log(`   ✅ Summary: ${summary}`);

			nodes.push({
				id: file.path,
				summary: summary,
			});
		} catch (error) {
			console.error(`   ❌ Error analyzing ${file.path}:`, error);
		}
	}

	console.log(`\n✅ Analysis complete: ${nodes.length} nodes created`);
	console.log(
		"Nodes:",
		nodes.map((n) => ({ id: n.id, summary: n.summary.slice(0, 50) + "..." })),
	);

	return {
		graph_data: {
			nodes,
			edges: [],
		},
	};
}

export async function build_edges_node(state: AgentState) {
	console.log("\n🔗 BUILD EDGES NODE CALLED");
	console.log("Files to process:", state.files?.length || 0);
	console.log("Existing nodes:", state.graph_data?.nodes?.length || 0);

	if (!state.files || state.files.length === 0) {
		console.error("❌ No files to build edges from!");
		return {
			graph_data: {
				nodes: state.graph_data?.nodes || [],
				edges: [],
			},
		};
	}

	const edges = [];

	for (const file of state.files) {
		console.log(`\n🔎 Extracting imports from: ${file.path}`);

		const importRegex = /import .* from ['"](.+)['"]/g;
		let match;
		let importCount = 0;

		while ((match = importRegex.exec(file.content)) !== null) {
			if (match[1].startsWith("./") || match[1].startsWith("../")) {
				console.log(`→ Found import: ${match[1]}`);
				edges.push({
					source: file.path,
					target: match[1],
				});
				importCount++;
			}
		}

		if (importCount === 0) {
			console.log("   ℹ️  No local imports found");
		}
	}

	console.log(`\n✅ Edges built: ${edges.length} total`);
	console.log("Sample edges:", edges.slice(0, 3));
	console.log(`Graph data: ${!!state.graph_data}`);
	console.log(`Nodes in graph: ${state.graph_data?.nodes?.length || 0}`);

	return {
		graph_data: {
			nodes: state.graph_data.nodes,
			edges,
		},
	};
}

export const tool_node = new ToolNode(tools);
