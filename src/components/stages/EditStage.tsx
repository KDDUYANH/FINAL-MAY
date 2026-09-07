import React from 'react';
import { StudioCanvas } from '../canvas/StudioCanvas';
import { ContextualInspector } from '../inspector/ContextualInspector';

export const EditStage: React.FC = () => {
  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Central Interactive Canvas Viewport */}
      <StudioCanvas />

      {/* Contextual Right Inspector Panel */}
      <ContextualInspector />
    </div>
  );
};
