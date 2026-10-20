import React, { useState } from 'react';
import { JdMatchResult, ResumeData } from '../types/resume';
import {
  X,
  Target,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileText,
} from 'lucide-react';

interface JdMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  jdText: string;
  onJdTextChange: (text: string) => void;
  result: JdMatchResult | null;
  onAddSkillToResume: (skill: string) => void;
}

const SAMPLE_JDS = [
  {
    title: 'Senior Full Stack Engineer (Stripe / Fintech)',
    text: `About the Role:
We are looking for a Senior Full Stack Software Engineer to build scalable microservices and world-class developer interfaces.

Requirements:
- 5+ years of experience with TypeScript, React, Next.js, Node.js, and Go or Python.
- Strong proficiency in SQL (PostgreSQL), Redis caching, and event-driven architecture using Kafka or RabbitMQ.
- Hands-on experience with AWS (ECS, Lambda, S3), Docker, Kubernetes, and Terraform.
- Solid background in distributed systems, RESTful API design, and GraphQL.
- Strong focus on unit testing (Jest, Cypress), CI/CD automation, and web performance optimization.`,
  },
  {
    title: 'Machine Learning / AI Engineer (OpenAI / Anthropic style)',
    text: `About the Role:
We are seeking an experienced ML / GenAI Engineer to architect generative AI applications, fine-tune foundation models, and optimize inference serving.

Requirements:
- 4+ years developing with Python, PyTorch, Hugging Face Transformers, and C++.
- Expertise in RAG (Retrieval-Augmented Generation), LangChain, LlamaIndex, and Vector Databases (Pinecone, Qdrant, Chroma).
- Deep experience deploying models with vLLM, TensorRT-LLM, Triton Inference Server, and Triton.
- Familiarity with MLOps pipelines (Kubeflow, MLflow, Weights & Biases) on AWS or GCP.
- Background in distributed training (DeepSpeed), latency optimization, and automated hallucination scoring.`,
  },
];

export const JdMatcherModal: React.FC<JdMatcherModalProps> = ({
  isOpen,
  onClose,
  jdText,
  onJdTextChange,
  result,
  onAddSkillToResume,
}) => {
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleAddSkill = (skill: string) => {
    onAddSkillToResume(skill);
    setAddedSkills((prev) => new Set(prev).add(skill));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">PushResume Job Description Optimizer</h2>
              <p className="text-xs text-slate-400">
                Extract keywords, uncover gap analysis, and align resume skills to employer requirements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Sample quick load */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Load Target Job Example:</span>
            {SAMPLE_JDS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => onJdTextChange(sample.text)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-md transition font-medium text-slate-700"
              >
                {sample.title}
              </button>
            ))}
          </div>

          {/* Job description input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Paste Target Job Description (JD)
            </label>
            <textarea
              rows={6}
              value={jdText}
              onChange={(e) => onJdTextChange(e.target.value)}
              placeholder="Paste job posting text here (Requirements, Tech Stack, Qualifications)..."
              className="w-full text-xs p-3 font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Match Score Display */}
          {result && (
            <div className="space-y-5">
              <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-slate-800 border-4 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-400">
                    {result.matchScore}%
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Target Keyword Match Rate</h3>
                    <p className="text-xs text-slate-400">
                      {result.matchedCount} of {result.totalJdKeywords} required skills &amp; concepts present in your resume
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-lg text-center">
                    <span className="text-sm font-bold text-emerald-300 block">
                      {result.matchedCount}
                    </span>
                    <span className="text-[10px] text-emerald-400">Matched</span>
                  </div>
                  <div className="bg-rose-950/60 border border-rose-500/40 px-3 py-2 rounded-lg text-center">
                    <span className="text-sm font-bold text-rose-300 block">
                      {result.missingCount}
                    </span>
                    <span className="text-[10px] text-rose-400">Missing</span>
                  </div>
                </div>
              </div>

              {/* Missing Keywords Gap Analysis with 1-click add */}
              {result.missingKeywords.length > 0 && (
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Missing High-Value Keywords (Click to Add to Skills)
                    </span>
                    <span className="text-[11px] text-rose-600 font-medium">
                      {result.missingKeywords.length} gaps
                    </span>
                  </div>
                  <p className="text-xs text-rose-700">
                    Applicant Tracking Systems reject or rank low resumes lacking these specific terms:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.missingKeywords.map((keyword, i) => {
                      const isAdded = addedSkills.has(keyword);
                      return (
                        <button
                          key={i}
                          onClick={() => handleAddSkill(keyword)}
                          disabled={isAdded}
                          className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1 transition ${
                            isAdded
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : 'bg-white border-rose-300 text-rose-900 hover:bg-rose-100 hover:border-rose-400'
                          }`}
                        >
                          {isAdded ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Plus className="w-3 h-3 text-rose-600" />
                          )}
                          <span className="capitalize">{keyword}</span>
                          {isAdded && <span className="text-[10px] text-emerald-700 font-bold ml-0.5">Added</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matched Keywords */}
              {result.matchedKeywords.length > 0 && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Matched Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.matchedKeywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 font-medium capitalize"
                      >
                        ✓ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wide">
                    Tailoring Recommendations:
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
