import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import type { AgentState } from "@/types/agent-state";
import { cn } from "@/lib/utils";

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

const AnalysisProgressStep = ({ progress }: { progress: Progress }) => {
  const isInProgress = progress.status === "in-progress";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
        isInProgress
          ? "bg-[#1C212D] border-blue-500/30"
          : "bg-zinc-900 border-zinc-800",
        "hover:bg-zinc-800/60"
      )}
    >
      <StatusIcon status={progress.status} />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium capitalize",
            isInProgress ? "text-blue-400" : "text-neutral-200"
          )}
        >
          {progress.step.replace("_", " ")}
        </p>
        <p className="text-xs text-neutral-400 truncate">{progress.message}</p>
      </div>
    </div>
  );
};

export function ProgressLoader({
  isLoading,
  analysisProgress,
  fileCount,
}: AnalysisLoadingOverlayProps) {
  if (!isLoading) return null;

  const showSpinner =
    analysisProgress.length === 0 ||
    analysisProgress.some((p) => p.status === "in-progress");

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            {showSpinner ? (
              <Loader2 className="h-6 w-6 text-blue-400 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Analyzing Repository
              </h3>
              <p className="text-sm text-neutral-400">
                {analysisProgress?.length > 0
                  ? `Processing ${fileCount || 0} files...`
                  : "Preparing analysis..."}
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