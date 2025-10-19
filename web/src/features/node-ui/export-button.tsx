'use client';

import React from 'react';
import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow-diagram.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
  const { getNodes } = useReactFlow();
  
  const onClick = () => {
    const viewportElement = document.querySelector('.react-flow__viewport');

    if (!viewportElement) {
      console.error("React Flow viewport element not found.");
      return;
    }

    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0.1);

    toPng(viewportElement as HTMLElement, {
      backgroundColor: '#ffffff', 
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        onClick={onClick}
        className="
          flex items-center gap-2 px-4 py-2 
          font-semibold text-white bg-card
          border rounded-lg shadow-lg
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
          transition-all duration-200
          text-xs"
      >
        <Download className="w-4 h-4" />
        <span>Download Image</span>
      </button>
    </Panel>
  );
}

export default DownloadButton;