import { CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";
import { Annotation } from "@langchain/langgraph";

export interface GraphNode {
	id: string;
	summary: string;
}

export interface GraphEdge {
	source: string;
	target: string;
}

export interface GraphData {
	nodes: GraphNode[];
	edges: GraphEdge[];
}

export interface FileObject {
	path: string;
	content: string;
}

export interface AnalysisProgress {
  step: string;
  status: "pending" | "in-progress" | "completed" | "error";
  message: string;
}

export const AgentStateAnnotation = Annotation.Root({
	...CopilotKitStateAnnotation.spec,
	files: Annotation<FileObject[]>,
	graph_data: Annotation<GraphData>,
	analysis_progress: Annotation<AnalysisProgress[]>
});

export type AgentState = typeof AgentStateAnnotation.State;
