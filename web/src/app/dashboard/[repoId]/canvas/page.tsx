"use client";

import {
    TreeExpander,
    TreeIcon,
    TreeLabel,
    TreeNode,
    TreeNodeContent,
    TreeNodeTrigger,
    TreeProvider,
    TreeView,
} from "@/components/ui/tree";
import { FlowCanvas } from "@/features/node-ui/canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DependencyDetective = () => {
    const [selectedFile, setSelectedFile] = useState<string>("button.tsx");
    const [showChat, setShowChat] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-full w-full flex-col bg-neutral-50 dark:bg-black py-2">
            {/* Header/Toolbar */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 px-4">
                <div className="flex items-center gap-4">
                    {/* Hamburger menu for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-neutral-600 dark:text-neutral-400"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                        Dependency Detective
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={showChat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowChat(!showChat)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Assistant
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* File Tree Sidebar (Responsive & Themed) */}
                <aside
                    className={cn(
                        "absolute md:static top-0 left-0 h-full z-20 w-64 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto bg-white dark:bg-zinc-950 transition-transform duration-300 ease-in-out",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    )}
                >
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Repository Files
                        </p>
                    </div>
                    <TreeProvider
                        defaultExpandedIds={["src", "components", "ui", "app"]}
                        onSelectionChange={(ids) => {
                            if (ids.length > 0) {
                                setSelectedFile(ids[0]);
                            }
                        }}
                        selectedIds={[selectedFile]}
                    >
                        <TreeView className="p-2">
                            <TreeNode nodeId="src">
                                <TreeNodeTrigger>
                                    <TreeExpander hasChildren />
                                    <TreeIcon hasChildren />
                                    <TreeLabel>src</TreeLabel>
                                </TreeNodeTrigger>
                                <TreeNodeContent hasChildren>
                                </TreeNodeContent>
                            </TreeNode>
                        </TreeView>
                    </TreeProvider>
                </aside>

                {/* Main Canvas */}
                <main className="flex-1 relative overflow-hidden bg-neutral-100/50 dark:bg-zinc-900/50">
                    <FlowCanvas />
                    
                    <div className="absolute top-4 left-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-neutral-200/60 dark:border-zinc-800/60 rounded-lg shadow-lg p-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-6">
                            <span className="text-neutral-500 dark:text-neutral-400">Files</span>
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100">47</span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <span className="text-neutral-500 dark:text-neutral-400">Dependencies</span>
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100">128</span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <span className="text-neutral-500 dark:text-neutral-400">Circular</span>
                            <span className="font-semibold text-red-600 dark:text-red-500">2</span>
                        </div>
                    </div>
                </main>

                {/* AI Chat Panel */}
                {showChat && (
                    <aside className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 flex flex-col">
                        <div className="p-3 h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">AI Assistant</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
                                onClick={() => setShowChat(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Ask me anything about the dependencies...
                            </p>
                        </div>
                        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                            {/* Input with themed focus ring */}
                            <Input
                                placeholder="Ask a question..."
                                className="focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                            />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}

export default DependencyDetective;