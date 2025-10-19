import { useState, useCallback, memo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DownloadButton from './export-button';

const initialNodes = [
  {
    id: 'n1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: 'n2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2', animated: true, type: 'smoothstep' },
];

const options = { 
  hideAttribution: true
}

export const FlowCanvas = memo(() => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<{ id: string; data: { label: string; }; position: { x: number; y: number; }; type: string; } | { id: string; data: { label: string; }; position: { x: number; y: number; }; type?: undefined; }>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<any>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

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