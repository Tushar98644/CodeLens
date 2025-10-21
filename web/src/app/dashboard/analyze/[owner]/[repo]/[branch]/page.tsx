"use client";

import {
    TreeExpander, TreeIcon, TreeLabel, TreeNode, TreeNodeContent, TreeNodeTrigger,
    TreeProvider, TreeView,
} from "@/components/ui/tree";
import { FlowCanvas } from "@/features/node-ui/canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Menu, X, Folder, File } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useFileTreeQuery } from "@/hooks/queries/useRepoQuery";
import { useAnalysisQuery } from "@/hooks/queries/useAnalysisQuery";
import { useParams } from "next/navigation";

const buildTree = (files: { path: string }[]) => {
    const tree: Record<string, any> = {};
    if (!files) return tree;

    files.forEach(file => {
        const parts = file.path.split('/');
        let currentLevel = tree;
        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    path: parts.slice(0, index + 1).join('/'),
                    isDirectory: index < parts.length - 1,
                    children: {},
                };
            }
            currentLevel = currentLevel[part].children;
        });
    });
    return tree;
};

const RenderTreeNodes = ({ nodes, level = 0 }: { nodes: any, level?: number }) => {
    return Object.values(nodes).map((node: any) => (
        <TreeNode key={node.path} nodeId={node.path} level={level}>
            <TreeNodeTrigger>
                <TreeExpander hasChildren={node.isDirectory} />
                <TreeIcon hasChildren={node.isDirectory} icon={node.isDirectory ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />} />
                <TreeLabel>{node.name}</TreeLabel>
            </TreeNodeTrigger>
            {node.isDirectory && (
                <TreeNodeContent hasChildren>
                    <RenderTreeNodes nodes={node.children} level={level + 1} />
                </TreeNodeContent>
            )}
        </TreeNode>
    ));
};

export default function DependencyDetective() {
    const { owner, repo, branch } = useParams<{ owner: string; repo: string; branch: string }>();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showChat, setShowChat] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { data: files, isLoading, isError } = useFileTreeQuery(owner, repo, branch);

    console.log(files);
    // const { data, isPending } = useAnalysisQuery(owner, repo, files);

    const fileTree = useMemo(() => buildTree(files), [files]);

    return (
        <div className="flex h-full w-full flex-col bg-neutral-50 dark:bg-black py-2">
            {/* Header/Toolbar */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 px-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">{repo}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant={showChat ? "default" : "outline"} size="sm" onClick={() => setShowChat(!showChat)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Assistant
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* File Tree Sidebar */}
                <aside
                    className={cn(
                        "absolute md:static top-0 left-0 h-full z-20 w-64 border-r dark:border-neutral-800 overflow-y-auto bg-white dark:bg-zinc-950 transition-transform",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    )}
                >
                    <div className="p-3 border-b dark:border-neutral-800">
                        <p className="text-sm font-medium">{owner}/{repo}</p>
                    </div>
                    {isLoading && <p className="p-4 text-sm text-neutral-400">Loading files...</p>}
                    {isError && <p className="p-4 text-sm text-red-500">Failed to load files.</p>}
                    {files && (
                        <TreeProvider onSelectionChange={(ids) => setSelectedFile(ids[0] || null)} selectedIds={selectedFile ? [selectedFile] : []}>
                            <TreeView className="p-2">
                                <RenderTreeNodes nodes={fileTree} level={0} />
                            </TreeView>
                        </TreeProvider>
                    )}
                </aside>

                {/* Main Canvas and Chat (unchanged) */}
                <main className="flex-1 relative overflow-hidden dark:bg-zinc-900/50">
                    <FlowCanvas />
                    <div className="absolute top-4 left-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border rounded-lg shadow-lg p-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-6"><span className="dark:text-neutral-400">Files</span><span className="font-semibold">47</span></div>
                        <div className="flex items-center justify-between gap-6"><span className="dark:text-neutral-400">Dependencies</span><span className="font-semibold">128</span></div>
                        <div className="flex items-center justify-between gap-6"><span className="dark:text-neutral-400">Circular</span><span className="font-semibold text-red-500">2</span></div>
                    </div>
                </main>
                {showChat && (
                    <aside className="w-80 border-l dark:border-neutral-800 bg-white dark:bg-zinc-950 flex flex-col">
                        <div className="p-3 h-16 border-b dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 dark:text-blue-400" /><p className="text-sm font-medium">AI Assistant</p></div>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowChat(false)}><X className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4"><p className="text-sm dark:text-neutral-400">Ask me anything...</p></div>
                        <div className="p-3 border-t dark:border-neutral-800"><Input placeholder="Ask a question..." /></div>
                    </aside>
                )}
            </div>
        </div>
    );
}