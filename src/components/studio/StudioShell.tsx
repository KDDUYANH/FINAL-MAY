"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { Header } from "./Header";
import { ToolSidebar } from "./ToolSidebar";
import { StudioCanvas } from "./StudioCanvas";
import { InspectorPanel } from "./InspectorPanel";
import { BatchDock } from "./BatchDock";
import { HomeDashboard } from "./HomeDashboard";
import { BatchPreviewModal } from "./BatchPreviewModal";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

export const StudioShell: React.FC = () => {
  const { viewMode } = useStudioStore();

  if (viewMode === "home") {
    return (
      <>
        <KeyboardShortcuts />
        <HomeDashboard />
      </>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-may-surface text-may-dark font-sans overflow-hidden select-none">
      <KeyboardShortcuts />
      <Header />

      {/* Main 3-Zone Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <ToolSidebar />

        <main className="flex-1 relative overflow-hidden bg-may-surface">
          <StudioCanvas />
        </main>

        <InspectorPanel />
      </div>

      <BatchDock />
      <BatchPreviewModal />
    </div>
  );
};
