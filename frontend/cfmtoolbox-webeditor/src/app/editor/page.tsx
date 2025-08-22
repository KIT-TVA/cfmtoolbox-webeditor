"use client";
import { ReactFlowProvider } from "@xyflow/react";
import FeatureModelEditor from "../feature-model-reactflow";
export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <FeatureModelEditor />
    </ReactFlowProvider>
  );
}
