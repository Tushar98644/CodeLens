"use client";

import React from "react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "reactflow-diagram.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const viewportElement = document.querySelector(".react-flow__viewport");

    if (!viewportElement) {
      console.error("React Flow viewport element not found.");
      return;
    }

    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.1,
    );

    toPng(viewportElement as HTMLElement, {
      backgroundColor: "#ffffff",
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
        className="flex items-center gap-3 rounded-md text-xs font-medium transition-all duration-200 p-3 md:py-2 
        md:px-3 justify-center md:justify-start bg-neutral-100 dark:bg-[#262127] text-neutral-900 
        dark:text-pink-400 border border-neutral-200 dark:border-blue-500/20 backdrop-blur-sm opacity-80"
      >
        <Download className="w-4 h-4" />
        <span>Download Image</span>
      </button>
    </Panel>
  );
}

export default DownloadButton;
