import { MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { shouldContinue } from "./utils/edges";
import { chat_node, tool_node } from "./utils/nodes";
import { AgentStateAnnotation } from "./utils/state";

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("chat_node", chat_node)
  .addNode("tool_node", tool_node)
  .addEdge(START, "chat_node")
  .addEdge("tool_node", "chat_node")
  .addConditionalEdges("chat_node", shouldContinue as any);

const memory = new MemorySaver();

export const graph = workflow.compile({
  checkpointer: memory,
});