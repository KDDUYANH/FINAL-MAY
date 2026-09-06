"use client";

import React from "react";
import Image from "next/image";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { WorkflowStep } from "@/types/studio";
import { Sparkles, Download, ShieldCheck, HelpCircle } from "lucide-react";

const STEPS: { key: WorkflowStep; label: string; num: string }[] = [
  { key: "UPLOAD", label: "UPLOAD", num: "01" },
  { key: "ENHANCE", label: "ENHANCE", num: "02" },
  { key: "PROTECT", label: "PROTECT", num: "03" },
  { key: "EXPORT", label: "EXPORT", num: "04" },
];

export const Header: React.FC = () => {
  const { workflowStep, setWorkflowStep, demoMode, assets } = useStudioStore();

  return (
    <header className="h-16 border-b border-may-border bg-may-surface/80 backdrop-blur px-6 flex items-center justify-between select-none z-30 relative">
      {/* Left Brand Identifier */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-may-rosegold/10 text-may-rosegold font-serif font-bold text-lg border border-may-rosegold/20">
          M
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg tracking-wider font-semibold text-may-dark">
              {MAY_BRAND_CONFIG.name}
            </h1>
            <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-may-blush text-may-dark font-medium border border-may-rosegold/30">
              STUDIO v1
            </span>
          </div>
          <p className="text-[10px] text-may-muted tracking-wider">
            {MAY_BRAND_CONFIG.tagline}
          </p>
        </div>
      </div>

      {/* Center 4-Step Visible Workflow Bar */}
      <nav className="flex items-center gap-1 sm:gap-2 bg-may-blushLight p-1 rounded-xl border border-may-border">
        {STEPS.map((step, idx) => {
          const isActive = workflowStep === step.key;
          return (
            <button
              key={step.key}
              onClick={() => setWorkflowStep(step.key)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-may-dark shadow-card border border-may-rosegold/30 font-semibold"
                  : "text-may-muted hover:text-may-dark hover:bg-white/50"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold ${
                  isActive ? "text-may-rosegold" : "text-may-muted/60"
                }`}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Mode Badge & Primary Action */}
      <div className="flex items-center gap-3">
        {demoMode && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium"
            title="Demo Mode: Runs safe local compositing without requiring external API keys"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px]">DEMO MODE</span>
          </div>
        )}

        <button
          onClick={() => setWorkflowStep("EXPORT")}
          disabled={assets.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-may-dark text-white hover:bg-may-dark/90 transition-all text-xs font-medium shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Asset</span>
        </button>
      </div>
    </header>
  );
};
