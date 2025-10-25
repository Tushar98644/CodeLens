import type { AgentState } from "@/types/agent-state";

type StatsCardProps = {
  graphData: AgentState["graph_data"];
};

export function StatsCard({ graphData }: StatsCardProps) {
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 overflow-hidden rounded-lg bg-white/90 dark:bg-zinc-950/60 backdrop-blur-2xl border border-neutral-200 dark:border-white/8 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-3 space-y-2 text-sm">
      <div className="flex items-center justify-between gap-6">
        <span className="text-neutral-500 dark:text-neutral-400">Files</span>
        <span className="font-semibold text-neutral-800 dark:text-white/95">
          {graphData.nodes.length}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-neutral-500 dark:text-neutral-400">Dependencies</span>
        <span className="font-semibold text-neutral-800 dark:text-white/95">
          {graphData.edges?.length || 0}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-neutral-500 dark:text-neutral-400">Circular</span>
        <span className="font-semibold text-red-500">0</span>
      </div>
    </div>
  );
}