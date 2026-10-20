import React from 'react';
import {
  FileText,
  BarChart3,
  Target,
  Code2,
  Printer,
  Sparkles,
  BookOpen,
  ChevronDown,
  Download,
  Loader2,
} from 'lucide-react';
import { ResumeTemplateId, AtsScoreResult, JdMatchResult } from '../types/resume';

interface NavbarProps {
  template: ResumeTemplateId;
  onSelectTemplate: (t: ResumeTemplateId) => void;
  atsScore: AtsScoreResult;
  jdResult: JdMatchResult | null;
  onOpenAtsModal: () => void;
  onOpenJdModal: () => void;
  onOpenLatexModal: () => void;
  onOpenFeaturesModal: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isExportingPdf?: boolean;
  onLoadSample: (type: 'swe' | 'aiml') => void;
  editorMode: 'split' | 'editor' | 'preview';
  onChangeEditorMode: (mode: 'split' | 'editor' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  template,
  onSelectTemplate,
  atsScore,
  jdResult,
  onOpenAtsModal,
  onOpenJdModal,
  onOpenLatexModal,
  onOpenFeaturesModal,
  onPrint,
  onDownloadPdf,
  isExportingPdf = false,
  onLoadSample,
  editorMode,
  onChangeEditorMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              <span className="font-latex text-xl">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">PushResume</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ATS LaTeX
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                ATS-Optimized LaTeX Resume Builder &amp; Auditor
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Features Explainer */}
            <button
              onClick={onOpenFeaturesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="PushResume Features & Architecture Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">PushResume Features</span>
              <span className="md:hidden">Features</span>
            </button>

            {/* ATS Score Button */}
            <button
              onClick={onOpenAtsModal}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border transition ${
                atsScore.overallScore >= 85
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  : atsScore.overallScore >= 70
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>ATS Score:</span>
              <span className="font-bold text-sm">{atsScore.overallScore}%</span>
              <span className="px-1 py-0.2 rounded text-[10px] bg-black/40">
                {atsScore.grade}
              </span>
            </button>

            {/* JD Matcher Button */}
            <button
              onClick={onOpenJdModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">JD Optimizer</span>
              {jdResult && jdResult.matchScore > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {jdResult.matchScore}%
                </span>
              )}
            </button>

            {/* LaTeX Export */}
            <button
              onClick={onOpenLatexModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="View & Export Overleaf-compatible LaTeX Code"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">LaTeX Source</span>
            </button>

            {/* Direct PDF Download */}
            <button
              onClick={onDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white shadow transition cursor-pointer"
              title="Download ATS PDF file directly"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Sample Loader Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
                <span>Samples</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <button
                  onClick={() => onLoadSample('swe')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Full Stack Engineer (Jake's)
                </button>
                <button
                  onClick={() => onLoadSample('aiml')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  AI / Machine Learning
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subbar: Template and View toggles */}
        <div className="py-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-400 font-medium">Template:</span>
            <button
              onClick={() => onSelectTemplate('jake')}
              className={`px-2.5 py-1 rounded transition ${
                template === 'jake'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Jake's Resume (FAANG Standard)
            </button>
            <button
              onClick={() => onSelectTemplate('classic')}
              className={`px-2.5 py-1 rounded transition ${
                template === 'classic'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Academic LaTeX Serif
            </button>
            <button
              onClick={() => onSelectTemplate('modern')}
              className={`px-2.5 py-1 rounded transition ${
                template === 'modern'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Modern Tech Clean
            </button>
            <button
              onClick={() => onSelectTemplate('minimal')}
              className={`px-2.5 py-1 rounded transition ${
                template === 'minimal'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Executive Minimal
            </button>
          </div>

          {/* Editor view toggle */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onChangeEditorMode('editor')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                editorMode === 'editor'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Editor Only
            </button>
            <button
              onClick={() => onChangeEditorMode('split')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                editorMode === 'split'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => onChangeEditorMode('preview')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                editorMode === 'preview'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview Only
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
