/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ResumeData,
  ResumeTemplateId,
  AtsScoreResult,
  JdMatchResult,
} from './types/resume';
import {
  SOFTWARE_ENGINEER_RESUME,
  AI_ML_ENGINEER_RESUME,
} from './data/sampleResumes';
import { calculateAtsScore } from './services/atsScorer';
import { analyzeJobDescription } from './services/jdOptimizer';
import { generateLatexCode } from './services/latexGenerator';
import { sanitizeResume } from './services/resumeParser';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { AtsScoreModal } from './components/AtsScoreModal';
import { JdMatcherModal } from './components/JdMatcherModal';
import { LatexCodeModal } from './components/LatexCodeModal';
import { FeatureExplainerModal } from './components/FeatureExplainerModal';
import { BulletEnhancerModal } from './components/BulletEnhancerModal';
import { ResumeImportModal } from './components/ResumeImportModal';
import {
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Target,
  Sparkles,
  Upload,
  Info,
  BookOpen,
} from 'lucide-react';

const DEFAULT_JD = `We are looking for a Senior Full Stack Software Engineer to build scalable microservices and developer platforms.
Requirements:
- 5+ years building distributed applications in TypeScript, React, Go, and Python.
- Proven expertise in PostgreSQL, Redis caching, and Kafka event streaming.
- Deep hands-on experience with Docker, Kubernetes, AWS, and CI/CD pipelines.
- Strong knowledge of microservices architecture, RESTful APIs, and GraphQL.
- Strong background in unit testing (Jest) and web performance optimization.`;

export default function App() {
  const [resume, setResume] = useState<ResumeData>(SOFTWARE_ENGINEER_RESUME);
  const [template, setTemplate] = useState<ResumeTemplateId>('jake');
  const [editorMode, setEditorMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [jdText, setJdText] = useState(DEFAULT_JD);

  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isLatexModalOpen, setIsLatexModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Bullet Enhancer modal state
  const [activeBullet, setActiveBullet] = useState<{
    text: string;
    onApply: (newText: string) => void;
  } | null>(null);

  // Memoized computations
  const atsScore: AtsScoreResult = useMemo(() => calculateAtsScore(resume), [resume]);
  const jdResult: JdMatchResult = useMemo(
    () => analyzeJobDescription(jdText, resume),
    [jdText, resume]
  );
  const latexSource: string = useMemo(() => generateLatexCode(resume), [resume]);

  // Handlers
  const handleOpenBulletEnhancer = (
    bulletText: string,
    onApply: (newText: string) => void
  ) => {
    setActiveBullet({ text: bulletText, onApply });
  };

  const handleAddSkillToResume = (skill: string) => {
    // Add to first skills category or create one
    if (resume.skills.length > 0) {
      const updated = [...resume.skills];
      const existing = updated[0].skills;
      if (!existing.toLowerCase().includes(skill.toLowerCase())) {
        updated[0] = {
          ...updated[0],
          skills: `${existing}, ${skill}`,
        };
        setResume({ ...resume, skills: updated });
      }
    } else {
      setResume({
        ...resume,
        skills: [{ id: `s-${Date.now()}`, category: 'Target Skills', skills: skill }],
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = (type: 'swe' | 'aiml') => {
    if (type === 'swe') {
      setResume(SOFTWARE_ENGINEER_RESUME);
    } else {
      setResume(AI_ML_ENGINEER_RESUME);
    }
  };

  return (
    <ErrorBoundary fallbackResume={() => setResume(SOFTWARE_ENGINEER_RESUME)}>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        {/* Navigation */}
        <Navbar
          template={template}
          onSelectTemplate={setTemplate}
          atsScore={atsScore}
          jdResult={jdResult}
          onOpenAtsModal={() => setIsAtsModalOpen(true)}
          onOpenJdModal={() => setIsJdModalOpen(true)}
          onOpenLatexModal={() => setIsLatexModalOpen(true)}
          onOpenFeaturesModal={() => setIsFeaturesModalOpen(true)}
          onPrint={handlePrint}
          onLoadSample={handleLoadSample}
          editorMode={editorMode}
          onChangeEditorMode={setEditorMode}
        />

        {/* Feature Summary Bar - Explaining PushResume to the user */}
        <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 font-semibold uppercase text-[10px] tracking-wider border border-indigo-500/30">
                App Breakdown
              </span>
              <span className="text-white font-medium">
                PushResume.net Architecture &amp; Features:
              </span>
              <span className="text-slate-400 hidden lg:inline">
                Professional LaTeX-style builder • ATS Scoring Engine • Job Description Matcher • Free Review
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFeaturesModalOpen(true)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Inspect All Features</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          {editorMode === 'split' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Interactive Editor */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Resume Content Editor
                  </h2>
                  <span className="text-xs text-slate-500">Auto-saves in real time</span>
                </div>
                <ResumeEditor
                  resume={resume}
                  onChange={(updated) => setResume(sanitizeResume(updated))}
                  onOpenBulletEnhancer={handleOpenBulletEnhancer}
                />
              </div>

              {/* Right: Live LaTeX Preview */}
              <div className="lg:col-span-7 order-1 lg:order-2 sticky top-28">
                <ResumePreview resume={resume} template={template} />
              </div>
            </div>
          ) : editorMode === 'editor' ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Full Width Editor
                </h2>
                <button
                  onClick={() => setEditorMode('split')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Back to Split View
                </button>
              </div>
              <ResumeEditor
                resume={resume}
                onChange={(updated) => setResume(sanitizeResume(updated))}
                onOpenBulletEnhancer={handleOpenBulletEnhancer}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Full Page Document Preview
                </h2>
                <button
                  onClick={() => setEditorMode('split')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Back to Split View
                </button>
              </div>
              <ResumePreview resume={resume} template={template} />
            </div>
          )}
        </main>

        {/* Modals */}
        {isAtsModalOpen && (
          <AtsScoreModal
            isOpen={isAtsModalOpen}
            onClose={() => setIsAtsModalOpen(false)}
            result={atsScore}
          />
        )}

        {isJdModalOpen && (
          <JdMatcherModal
            isOpen={isJdModalOpen}
            onClose={() => setIsJdModalOpen(false)}
            jdText={jdText}
            onJdTextChange={setJdText}
            result={jdResult}
            onAddSkillToResume={handleAddSkillToResume}
          />
        )}

        {isLatexModalOpen && (
          <LatexCodeModal
            isOpen={isLatexModalOpen}
            onClose={() => setIsLatexModalOpen(false)}
            latexCode={latexSource}
          />
        )}

        {isFeaturesModalOpen && (
          <FeatureExplainerModal
            isOpen={isFeaturesModalOpen}
            onClose={() => setIsFeaturesModalOpen(false)}
          />
        )}

        {activeBullet && (
          <BulletEnhancerModal
            isOpen={Boolean(activeBullet)}
            onClose={() => setActiveBullet(null)}
            originalBullet={activeBullet.text}
            onApply={activeBullet.onApply}
          />
        )}

        {isImportModalOpen && (
          <ResumeImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(imported) => {
              const safe = sanitizeResume(imported);
              setResume(safe);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
