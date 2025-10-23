"use client";

import { TreeProvider, TreeView } from "@/components/ui/tree";
import { buildTree } from "@/utils/build-tree";
import { FlowCanvas } from "@/features/node-ui/canvas";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useFileTreeQuery } from "@/hooks/queries/useRepoQuery";
import { useParams } from "next/navigation";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { RenderTreeNodes } from "@/features/canvas/tree-renderer";

type AgentState = {
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
};

export default function DependencyDetective() {
  const { owner, repo, branch } = useParams<{
    owner: string;
    repo: string;
    branch: string;
  }>();
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const analysisTriggeredRef = useRef(false);

  const {
    data:files,
    isPending,
    isError,
  } = useFileTreeQuery(owner, repo, branch);

  const { state, setState, run } = useCoAgent<AgentState>({
    name: "starterAgent",
    initialState: {
      files: [],
      graph_data: { nodes: [], edges: [] },
      messages: [],
      analysis_progress: [],
    },
  });

  // ✅ Trigger analysis once
  useEffect(() => {
    if (
      files && 
      files.length > 0 && 
      !analysisTriggeredRef.current && 
      state.graph_data.nodes.length === 0
    ) {
      console.log("🚀 Starting analysis with", files.length, "files");
      analysisTriggeredRef.current = true;

      const preparedFiles = files.map((f: any) => ({
        path: f.path,
        content: f.content || "",
      }));

      setState({
        ...state,
        files: preparedFiles,
      });
      
      // @ts-ignore
      run(() => {
        return new TextMessage({
          role: MessageRole.User,
          content: `Analyze the ${preparedFiles.length} files and build a dependency graph.`,
        });
      });
    }
  }, [files, state.graph_data?.nodes?.length]);

  const fileTree = useMemo(() => buildTree(files), [files]);
  const graphData = state?.graph_data;

  const isLoading = !graphData || graphData.nodes.length === 0;

  useCoAgentStateRender<AgentState>({
    name: "starterAgent",
    render: ({ state }) => {
      const showProgress = 
        state.analysis_progress?.length > 0 && 
        (!state.messages || state.messages.length === 0);

      if (!showProgress) {
        return null;
      }

      return (
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold mb-3">Analysis Progress</p>
          {state.analysis_progress.map((progress, index) => (
            <div key={index} className="flex items-start gap-3">
              {progress.status === "completed" && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              {progress.status === "in-progress" && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
              )}
              {progress.status === "pending" && (
                <Circle className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
              )}
              {progress.status === "error" && (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">
                  {progress.step.replace('_', ' ')}
                </p>
                <p className="text-xs text-neutral-500">{progress.message}</p>
              </div>
            </div>
          ))}
        </div>
      );
    },
  });

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50 dark:bg-black py-2">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{repo}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showChat ? "default" : "outline"}
            size="sm"
            onClick={() => setShowChat(!showChat)}
            disabled={isLoading}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* File Tree Sidebar */}
        <aside
          className={cn(
            "absolute md:static top-0 left-0 h-full z-20 w-56 border-r dark:border-neutral-800 overflow-y-auto bg-white dark:bg-zinc-950 transition-transform",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="p-3 border-b dark:border-neutral-800">
            <p className="text-sm font-medium">
              {owner}/{repo}
            </p>
          </div>
          {isPending && (
            <p className="p-4 text-sm text-neutral-400">Loading files...</p>
          )}
          {isError && (
            <p className="p-4 text-sm text-red-500">Failed to load files.</p>
          )}
          {files && (
            <TreeProvider
              onSelectionChange={(ids) => setSelectedFile(ids[0] || null)}
              selectedIds={selectedFile ? [selectedFile] : []}
            >
              <TreeView className="p-2">
                <RenderTreeNodes nodes={fileTree} level={0} />
              </TreeView>
            </TreeProvider>
          )}
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 relative overflow-hidden dark:bg-zinc-900/50">
          {isLoading && (
            <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-8 max-w-md w-full border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-4 mb-6">
                  <svg
                    className="animate-spin h-10 w-10 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 10-4 4H4z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold">Analyzing Repository</h3>
                    <p className="text-sm text-neutral-500">
                      {state.analysis_progress?.length > 0 
                        ? `Processing ${state.files?.length || 0} files...`
                        : "Preparing analysis..."
                      }
                    </p>
                  </div>
                </div>
                
                {/* Progress steps */}
                {state.analysis_progress && state.analysis_progress.length > 0 && (
                  <div className="space-y-3">
                    {state.analysis_progress.map((progress, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {progress.status === "completed" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                        {progress.status === "in-progress" && (
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                        )}
                        {progress.status === "pending" && (
                          <Circle className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                        )}
                        {progress.status === "error" && (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">
                            {progress.step.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-neutral-500">{progress.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flow Canvas */}
          <FlowCanvas graphData={graphData} />

          {/* Stats Card */}
          {graphData && graphData.nodes?.length > 0 && (
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
          )}
        </main>

        {/* AI Assistant Sidebar */}
        {showChat && (
          <aside className="w-80 border-l dark:border-neutral-800 bg-white dark:bg-zinc-950 flex flex-col">
            <div className="p-4 border-b dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-semibold">Dependency Assistant</p>
                  <p className="text-xs text-neutral-500">
                    {graphData?.nodes?.length || 0} files analyzed
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 min-h-0">
              <CopilotChat className="h-full"
                instructions={`
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
                `}
                labels={{
                  title: "",
                  initial: "Ask me about the codebase...",
                }}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}