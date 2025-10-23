import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, FileCode, FileJson, FileText } from 'lucide-react';
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from '@/components/nodes/base-node';

interface FileNodeData {
  id: string;
  summary: string;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'json') return FileJson;
  if (['ts', 'tsx', 'js', 'jsx'].includes(ext || '')) return FileCode;
  if (['md', 'txt'].includes(ext || '')) return FileText;
  return File;
};

export const FileNode = memo(({ data }: any) => {
  const filename = data.id.split('/').pop() || data.id;
  const Icon = getFileIcon(filename);

  return (
    <BaseNode
      className={`
        w-[280px]
        transition-all duration-200

      `}
    >
      {/* Header with filename */}
      <BaseNodeHeader className="border-b">
        <Icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <BaseNodeHeaderTitle className="truncate" title={data.id}>
          {filename}
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>

      {/* Content with summary */}
      <BaseNodeContent>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {data.summary}
        </p>
      </BaseNodeContent>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white dark:!border-zinc-900"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white dark:!border-zinc-900"
      />
    </BaseNode>
  );
});

FileNode.displayName = 'FileNode';
