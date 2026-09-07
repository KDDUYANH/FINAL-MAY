"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { Header } from "./Header";
import { CreateModule } from "./CreateModule";
import { EditModule } from "./EditModule";
import { ContentModule } from "./ContentModule";
import { BatchModule } from "./BatchModule";
import { LibraryModule } from "./LibraryModule";

export const StudioShell: React.FC = () => {
  const { activeModule } = useStudioStore();

  return (
    <div className="w-screen h-screen flex flex-col bg-may-surface text-may-dark font-sans overflow-hidden select-none">
      <Header />

      {/* Main Module Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeModule === "CREATE" && <CreateModule />}
        {activeModule === "EDIT" && <EditModule />}
        {activeModule === "CONTENT" && <ContentModule />}
        {activeModule === "BATCH" && <BatchModule />}
        {activeModule === "LIBRARY" && <LibraryModule />}
      </div>
    </div>
  );
};
