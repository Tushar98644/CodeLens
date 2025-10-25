import { memo, useEffect } from "react";
import { ReactFlow, Controls, Background, MiniMap, Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DownloadButton from "./export-button";
import { getLayoutedElements } from "@/utils/layout-elements";
import { nodeTypes } from "@/components/nodes";
import { resolveImportPath } from "@/utils/resolve-path";

interface FlowCanvasProps {
  graphData?: {
    nodes: Array<{ id: string; summary: string }>;
    edges: Array<{ source: string; target: string }>;
  };
}

const options = {
  hideAttribution: true,
};

export const FlowCanvas = memo(({ graphData }: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (graphData && graphData.nodes.length > 0) {
      console.log("Graph Data:", graphData);
      const flowNodes: Node[] = graphData.nodes.map((node) => ({
        id: node.id,
        type: "fileNode",
        data: {
          id: node.id,
          summary: node.summary,
        },
        position: { x: 0, y: 0 },
      }));

      const flowEdges: Edge[] = graphData.edges
        .map((edge, idx) => {
          const targetPath = resolveImportPath(edge.source, edge.target);

          return {
            id: `e-${edge.source}-${targetPath}-${idx}`,
            source: edge.source,
            target: targetPath,
            animated: true,
            type: "smoothstep",
            style: {
              stroke: "#ffffff", // A visible color like white
              strokeWidth: 2, // Make the line thicker
            },
          };
          // @ts-ignore
        })
        .filter((edge): edge is Edge => edge !== null);

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);

      // @ts-ignore
      setNodes(layoutedNodes);
      // @ts-ignore
      setEdges(layoutedEdges);
    }
  }, [graphData, setNodes, setEdges]);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
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
