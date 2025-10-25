import type { AgentState } from "@/types/agent-state";

type StatsCardProps = {
  graphData: AgentState["graph_data"];
};

export function StatsCard({ graphData }: StatsCardProps) {
  if (!graphData || graphData.nodes.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border rounded-lg shadow-lg p-3 space-y-2 text-sm">
      <div className="flex items-center justify-between gap-6">
        <span className="dark:text-neutral-400">Files</span>
        <span className="font-semibold">{graphData.nodes.length}</span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="dark:text-neutral-400">Dependencies</span>
        <span className="font-semibold">{graphData.edges?.length || 0}</span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="dark:text-neutral-400">Circular</span>
        <span className="font-semibold text-red-500">0</span>
      </div>
    </div>
  );
}
