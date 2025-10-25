import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import type { AgentState } from "@/types/agent-state";

type AiAssistantSidebarProps = {
  owner: string;
  repo: string;
  graphData: AgentState["graph_data"];
  onClose: () => void;
};

export function AiAssistantSidebar({ owner, repo, graphData, onClose }: AiAssistantSidebarProps) {
  const instructions = `
    You are analyzing ${owner}/${repo}.
    
    The repository has been analyzed:
    - Files: ${graphData?.nodes?.length || 0}
    - Dependencies: ${graphData?.edges?.length || 0}
    
    You have access to the full dependency graph in state.graph_data.
    Answer questions about:
    - What specific files do (use their summaries)
    - Dependencies between files
    - Code architecture and patterns
    - Suggestions for improvements
  `;

  return (
    <aside className="w-80 border-l dark:border-neutral-800 bg-white dark:bg-zinc-950 flex flex-col">
      <div className="p-4 border-b dark:border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 dark:text-blue-400" />
          <div>
            <p className="text-sm font-semibold">Dependency Assistant</p>
            <p className="text-xs text-neutral-500">{graphData?.nodes?.length || 0} files analyzed</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <CopilotChat
          className="h-full"
          instructions={instructions}
          labels={{
            title: "",
            initial: "Ask me about the codebase...",
          }}
        />
      </div>
    </aside>
  );
}
