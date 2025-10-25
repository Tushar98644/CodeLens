import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import type { AgentState } from "@/types/agent-state";

type Progress = AgentState["analysis_progress"][0];

type AnalysisLoadingOverlayProps = {
  isLoading: boolean;
  analysisProgress: Progress[];
  fileCount: number;
};

const StatusIcon = ({ status }: { status: Progress["status"] }) => {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
  }
  if (status === "in-progress") {
    return <Loader2 className="h-5 w-5 text-blue-400 animate-spin shrink-0" />;
  }
  if (status === "pending") {
    return <Circle className="h-5 w-5 text-zinc-600 shrink-0" />;
  }
  if (status === "error") {
    return <XCircle className="h-5 w-5 text-rose-400 shrink-0" />;
  }
  return null;
};

const AnalysisProgressStep = ({ progress }: { progress: Progress }) => (
  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-black/3 border border-white/6 hover:bg-black/5 transition-colors">
    <StatusIcon status={progress.status} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white/90 capitalize">{progress.step.replace("_", " ")}</p>
      <p className="text-xs text-white/40 truncate">{progress.message}</p>
    </div>
  </div>
);

export function ProgressLoader({ isLoading, analysisProgress, fileCount }: AnalysisLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950/60 backdrop-blur-2xl border border-white/8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] max-w-md w-full">
        {/* Subtle gradient mesh */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1.5 h-10 bg-black/10 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold text-white/95">Analyzing Repository</h3>
              <p className="text-sm text-white/50">
                {analysisProgress?.length > 0 ? `Processing ${fileCount || 0} files...` : "Preparing analysis..."}
              </p>
            </div>
          </div>

          {analysisProgress && analysisProgress.length > 0 && (
            <div className="space-y-2">
              {analysisProgress.map((progress, index) => (
                <AnalysisProgressStep key={index} progress={progress} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
