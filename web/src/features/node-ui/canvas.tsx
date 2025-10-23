import { useState, useCallback, memo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DownloadButton from './export-button';
import { getLayoutedElements } from '@/utils/layout-elements';

interface FlowCanvasProps {
  graphData?: {
    nodes: Array<{ id: string; summary: string }>;
    edges: Array<{ source: string; target: string }>;
  };
  isLoading?: boolean;
}

const options = {
  hideAttribution: true
}

export const FlowCanvas = memo(({ graphData, isLoading }: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (graphData && graphData.nodes.length > 0) {
      const flowNodes: Node[] = graphData.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        data: {
          label: node.id.split('/').pop() || node.id,
          summary: node.summary
        },
        position: { x: 0, y: 0 },
      }));

      const flowEdges: Edge[] = graphData.edges.map((edge, idx) => ({
        id: `e-${edge.source}-${edge.target}-${idx}`,
        source: edge.source,
        target: edge.target,
        animated: true,
        type: 'smoothstep',
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        flowNodes,
        flowEdges
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Analyzing repository...</p>
        </div>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-neutral-500">No dependency graph available</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode='dark'
        proOptions={options}
        fitView
      >
        <MiniMap nodeStrokeWidth={3} />
        <Background />
        <Controls />
        <DownloadButton />
      </ReactFlow>
    </div>
  );
});