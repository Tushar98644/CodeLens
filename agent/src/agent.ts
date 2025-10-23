import { MemorySaver, START, END, StateGraph } from "@langchain/langgraph";
import { routeEntry, shouldContinue } from "./utils/edges";
import {
	analyze_files_node,
	build_edges_node,
	chat_node,
	tool_node,
} from "./utils/nodes";
import { AgentStateAnnotation } from "./utils/state";

const workflow = new StateGraph(AgentStateAnnotation)
	.addNode("analyze", analyze_files_node)
	.addNode("build_edges", build_edges_node)
	.addNode("chat", chat_node)
	.addNode("tools", tool_node)

	.addConditionalEdges(START, routeEntry, {
		analyze: "analyze",
		chat: "chat",
	})

	.addEdge("analyze", "build_edges")
	.addEdge("build_edges", END)

	.addConditionalEdges("chat", shouldContinue, {
		tools: "tools",
		[END]: END,
	})
	.addEdge("tools", "chat");

const memory = new MemorySaver();

export const graph = workflow.compile({
	checkpointer: memory,
});
