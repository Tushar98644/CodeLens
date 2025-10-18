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
import { FileCode, FileText, FileType } from "lucide-react";
import { useState } from "react";

export default function CodebaseExample() {
    const [selectedFile, setSelectedFile] = useState<string>("button.tsx");

    return (
        <div className="grid h-[770px] w-full grid-cols-5">
            {/* File Explorer */}
            <div className="h-full w-full overflow-y-auto col-span-1">
                <TreeProvider
                    defaultExpandedIds={["src", "components", "ui", "app"]}
                    onSelectionChange={(ids) => {}}
                    selectedIds={[selectedFile]}
                >
                    <TreeView>
                        <TreeNode nodeId="src">
                            <TreeNodeTrigger>
                                <TreeExpander hasChildren />
                                <TreeIcon hasChildren />
                                <TreeLabel>src</TreeLabel>
                            </TreeNodeTrigger>
                            <TreeNodeContent hasChildren>
                                <TreeNode level={1} nodeId="components">
                                    <TreeNodeTrigger>
                                        <TreeExpander hasChildren />
                                        <TreeIcon hasChildren />
                                        <TreeLabel>components</TreeLabel>
                                    </TreeNodeTrigger>
                                    <TreeNodeContent hasChildren>
                                        <TreeNode isLast level={2} nodeId="ui">
                                            <TreeNodeTrigger>
                                                <TreeExpander hasChildren />
                                                <TreeIcon hasChildren />
                                                <TreeLabel>ui</TreeLabel>
                                            </TreeNodeTrigger>
                                            <TreeNodeContent hasChildren>
                                                <TreeNode isLast level={3} nodeId="button.tsx">
                                                    <TreeNodeTrigger>
                                                        <TreeExpander />
                                                        <TreeIcon icon={<FileCode className="h-4 w-4" />} />
                                                        <TreeLabel>button.tsx</TreeLabel>
                                                    </TreeNodeTrigger>
                                                </TreeNode>
                                            </TreeNodeContent>
                                        </TreeNode>
                                    </TreeNodeContent>
                                </TreeNode>
                                <TreeNode level={1} nodeId="lib">
                                    <TreeNodeTrigger>
                                        <TreeExpander hasChildren />
                                        <TreeIcon hasChildren />
                                        <TreeLabel>lib</TreeLabel>
                                    </TreeNodeTrigger>
                                    <TreeNodeContent hasChildren>
                                        <TreeNode isLast level={2} nodeId="utils.ts">
                                            <TreeNodeTrigger>
                                                <TreeExpander />
                                                <TreeIcon icon={<FileType className="h-4 w-4" />} />
                                                <TreeLabel>utils.ts</TreeLabel>
                                            </TreeNodeTrigger>
                                        </TreeNode>
                                    </TreeNodeContent>
                                </TreeNode>
                                <TreeNode isLast level={1} nodeId="app">
                                    <TreeNodeTrigger>
                                        <TreeExpander hasChildren />
                                        <TreeIcon hasChildren />
                                        <TreeLabel>app</TreeLabel>
                                    </TreeNodeTrigger>
                                    <TreeNodeContent hasChildren>
                                        <TreeNode level={2} nodeId="page.tsx">
                                            <TreeNodeTrigger>
                                                <TreeExpander />
                                                <TreeIcon icon={<FileCode className="h-4 w-4" />} />
                                                <TreeLabel>page.tsx</TreeLabel>
                                            </TreeNodeTrigger>
                                        </TreeNode>
                                        <TreeNode isLast level={2} nodeId="globals.css">
                                            <TreeNodeTrigger>
                                                <TreeExpander />
                                                <TreeIcon icon={<FileText className="h-4 w-4" />} />
                                                <TreeLabel>globals.css</TreeLabel>
                                            </TreeNodeTrigger>
                                        </TreeNode>
                                    </TreeNodeContent>
                                </TreeNode>
                            </TreeNodeContent>
                        </TreeNode>
                    </TreeView>
                </TreeProvider>
            </div>
            {/* Code Viewer */}
            <div className="h-full overflow-hidden col-span-4">
                <FlowCanvas />
            </div>
        </div>
    );
}
