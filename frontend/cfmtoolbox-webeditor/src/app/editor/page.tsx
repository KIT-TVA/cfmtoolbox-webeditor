"use client";
import { Suspense } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FeatureModelEditor from "../feature-model-reactflow";
export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ReactFlowProvider>
        <FeatureModelEditor />
      </ReactFlowProvider>
    </Suspense>
  );
}
