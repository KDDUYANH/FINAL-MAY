import React from 'react';
import { ToolsRail } from '../studio/ToolsRail';
import { StudioCanvas } from '../canvas/StudioCanvas';
import { ContextualInspector } from '../inspector/ContextualInspector';
import { BatchFilmstrip } from '../batch/BatchFilmstrip';
import { SmartRecommendationCard } from '../studio/SmartRecommendationCard';
import { useStudioStore } from '../../store/studioStore';

export const StudioView: React.FC = () => {
  const { assets, selectedAssetId } = useStudioStore();
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* 3-ZONE EDITOR: LEFT (TOOLS) | CENTER (CANVAS) | RIGHT (INSPECTOR) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Tools Rail */}
        <ToolsRail />

        {/* Center: Canvas Area with Smart Recommendation Header */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Smart Recommendation Banner if active asset has recommendation */}
          {activeAsset?.recommendation && !activeAsset.recommendation.isAlreadyGood && (
            <div className="px-6 pt-3 shrink-0 z-10">
              <SmartRecommendationCard />
            </div>
          )}

          {/* Canvas Component */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <StudioCanvas />
          </div>
        </div>

        {/* Right: Contextual Inspector */}
        <ContextualInspector />
      </div>

      {/* Persistent Bottom Batch Filmstrip */}
      <BatchFilmstrip />
    </div>
  );
};
