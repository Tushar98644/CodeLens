"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useCoAgent } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { buildTree } from "@/utils/build-tree";

import { useFileTreeQuery } from "@/hooks/queries/useRepoQuery";
import { useFileContentsQuery } from "@/hooks/queries/useFileQuery";

import { PageHeader } from "@/features/analyzer/page-header";
import { FileTreeSidebar } from "@/features/analyzer/file-tree-sidebar";
import { ProgressLoader } from "@/features/analyzer/progress-loader";
import { StatsCard } from "@/features/analyzer/stats-card";
import { AiAssistantSidebar } from "@/features/analyzer/ai-assistant";
import { FlowCanvas } from "@/features/node-ui/canvas";

import type { AgentState } from "@/types/agent-state";

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

  const { data: files, isPending: isTreePending, isError: isTreeError } = useFileTreeQuery(owner, repo, branch);

  const { data: filesWithContent } = useFileContentsQuery(owner, repo, files);

  const { state, setState, run } = useCoAgent<AgentState>({
    name: "starterAgent",
    initialState: {
      files: [],
      graph_data: { nodes: [], edges: [] },
      messages: [],
      analysis_progress: [],
    },
  });

  useEffect(() => {
    if (
      filesWithContent &&
      filesWithContent.length > 0 &&
      !analysisTriggeredRef.current &&
      state.graph_data.nodes.length === 0
    ) {
      analysisTriggeredRef.current = true;
      setState({ ...state, files: filesWithContent });

      // @ts-ignore
      run(() => {
        return new TextMessage({
          role: MessageRole.User,
          content: `Analyze the ${filesWithContent.length} files and build a dependency graph.`,
        });
      });
    }
  }, [filesWithContent, state.graph_data?.nodes?.length, run, setState, state]);

  const fileTree = useMemo(() => buildTree(files), [files]);
  const graphData = state?.graph_data;
  const isLoading = !graphData || graphData.nodes.length === 0;

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50 dark:bg-black py-2">
      <PageHeader
        repo={repo}
        isLoading={isLoading}
        showChat={showChat}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <FileTreeSidebar
          owner={owner}
          repo={repo}
          isSidebarOpen={isSidebarOpen}
          isPending={isTreePending}
          isError={isTreeError}
          files={files}
          fileTree={Object.values(fileTree)}
          selectedFile={selectedFile}
          onSelectFile={(id) => setSelectedFile(id)}
        />

        <main className="flex-1 relative overflow-hidden dark:bg-black/50">
          <ProgressLoader
            isLoading={isLoading}
            analysisProgress={state.analysis_progress}
            fileCount={state.files?.length || 0}
          />

          <FlowCanvas graphData={graphData} />

          <StatsCard graphData={graphData} />
        </main>

        {/* AI Assistant Sidebar */}
        {showChat && (
          <AiAssistantSidebar owner={owner} repo={repo} graphData={graphData} onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
}