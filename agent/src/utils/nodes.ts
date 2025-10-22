import { convertActionsToDynamicStructuredTools } from "@copilotkit/sdk-js/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { model } from "../config/llm";
import { tools } from "./tools";
import { AgentState } from "./state";
import { ToolNode } from "@langchain/langgraph/prebuilt";

export async function chat_node(state: AgentState, config: RunnableConfig) {

  const modelWithTools = model.bindTools!(
    [
      ...convertActionsToDynamicStructuredTools(state.copilotkit?.actions ?? []),
      ...tools,
    ],
  );

  const systemMessage = new SystemMessage({
    content: `You are a helpful assistant. The current proverbs are.`,
  });

  const response = await modelWithTools.invoke(
    [systemMessage, ...state.messages],
    config
  );

  return {
    messages: response,
  };
}


export async function analyze_files_node(state: AgentState) {
  const nodes = [];

  for (const file of state.files.slice(0, 10)) {
    const response = await model.invoke(
      `Summarize what this file does in 1-2 sentences:\n\nFile: ${file.path}\n\nCode:\n${file.content.slice(0, 1000)}`
    );
    
    nodes.push({
      id: file.path,
      summary: response.content as string
    });
  }

  return { 
    graph_data: { 
      nodes, 
      edges: [] 
    } 
  };
}

export async function build_edges_node(state: AgentState) {
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

  return {
    graph_data: {
      nodes: state.graph_data.nodes,
      edges
    }
  };
}

export const tool_node = new ToolNode(tools);
