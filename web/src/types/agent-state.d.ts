export interface AgentState {
  files: Array<{ path: string; content: string }>;
  graph_data: {
    nodes: Array<{ id: string; summary: string }>;
    edges: Array<{ source: string; target: string }>;
  };
  messages: any[];
  analysis_progress: Array<{
    step: string;
    status: "pending" | "in-progress" | "completed" | "error";
    message: string;
  }>;
}
