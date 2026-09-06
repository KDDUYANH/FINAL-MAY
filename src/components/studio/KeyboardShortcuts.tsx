"use client";

import React, { useEffect } from "react";
import { useStudioStore } from "@/store/studioStore";

export const KeyboardShortcuts: React.FC = () => {
  const { undo, redo, removeAsset, activeAssetId, closeBatchPreviewModal, batchPreviewModalOpen } =
    useStudioStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modal
      if (e.key === "Escape" && batchPreviewModalOpen) {
        e.preventDefault();
        closeBatchPreviewModal();
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }

      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Silent save state notification
        return;
      }

      // Delete key removes active asset if not typing in input
      if (
        e.key === "Delete" &&
        activeAssetId &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "SELECT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        removeAsset(activeAssetId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, removeAsset, activeAssetId, closeBatchPreviewModal, batchPreviewModalOpen]);

  return null;
};
