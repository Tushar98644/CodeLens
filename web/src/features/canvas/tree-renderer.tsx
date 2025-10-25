import {
  TreeNode,
  TreeNodeTrigger,
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNodeContent,
} from "@/components/ui/file-tree";
import { Folder, File } from "lucide-react";

export const RenderTreeNodes = ({ nodes, level = 0 }: { nodes: any; level?: number }) => {
  return Object.values(nodes).map((node: any) => (
    <TreeNode key={node.path} nodeId={node.path} level={level}>
      <TreeNodeTrigger>
        <TreeExpander hasChildren={node.isDirectory} />
        <TreeIcon
          hasChildren={node.isDirectory}
          icon={node.isDirectory ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
        />
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
