import React from 'react';
import { ContentBriefPanel } from '../content/ContentBriefPanel';
import { VisualComposer } from '../content/VisualComposer';
import { SocialCopyPanel } from '../content/SocialCopyPanel';
import { ContentPackModal } from '../content/ContentPackModal';

export const ContentStage: React.FC = () => {
  return (
    <div className="flex-1 flex overflow-hidden relative select-none">
      {/* 1. Left Brief & Product Truth Panel */}
      <ContentBriefPanel />

      {/* 2. Central Live Visual Composer */}
      <VisualComposer />

      {/* 3. Right Multi-Platform Social Copy Panel */}
      <SocialCopyPanel />

      {/* 4. Full 9-Piece Content Pack Modal */}
      <ContentPackModal />
    </div>
  );
};
