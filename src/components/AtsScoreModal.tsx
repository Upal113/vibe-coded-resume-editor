import React from 'react';
import { AtsScoreResult, AtsCheckItem } from '../types/resume';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AtsScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AtsScoreResult;
}

export const AtsScoreModal: React.FC<AtsScoreModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const renderStatusIcon = (status: AtsCheckItem['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
    }
  };

  const categories = [
    { name: 'Formatting & ATS Compatibility', data: result.categories.formatting, icon: Layers },
    { name: 'Impact, Metrics & STAR Method', data: result.categories.impactMetrics, icon: TrendingUp },
    { name: 'Technical Skills Taxonomy', data: result.categories.skillsRelevance, icon: Sparkles },
    { name: 'Structural Completeness', data: result.categories.structureCompleteness, icon: ShieldCheck },
    { name: 'Content & Density Quality', data: result.categories.contentQuality, icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">PushResume ATS Diagnostic Report</h2>
              <p className="text-xs text-slate-400">
                Automated parsing simulation across Workday, Greenhouse &amp; Lever ATS systems
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-indigo-900/50 shadow-inner">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-800 border-4 border-indigo-500 shadow-lg">
                <div className="text-center">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {result.overallScore}
                  </span>
                  <span className="text-xs text-indigo-300 block -mt-1">/100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-300">Overall ATS Score:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      result.grade === 'A+' || result.grade === 'A'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : result.grade === 'B'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Grade {result.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">{result.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center w-full sm:w-auto">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-lg font-bold text-emerald-400 block">
                  {result.quantifiedBulletCount} / {result.totalBulletCount}
                </span>
                <span className="text-[10px] text-slate-400">Quantified Bullets</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-lg font-bold text-indigo-400 block">
                  {result.actionVerbCount} / {result.totalBulletCount}
                </span>
                <span className="text-[10px] text-slate-400">STAR Action Verbs</span>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                High-Priority Optimization Tips
              </h3>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Category Audits */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Detailed ATS Auditing Breakdown
            </h3>

            {categories.map((cat, idx) => {
              const pct = Math.round((cat.data.score / cat.data.maxScore) * 100) || 0;
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            pct >= 85 ? 'bg-emerald-500' : pct >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {cat.data.score}/{cat.data.maxScore} pts
                      </span>
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-2 pt-1">
                    {cat.data.checks.map((check) => (
                      <div
                        key={check.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs flex items-start gap-2.5"
                      >
                        {renderStatusIcon(check.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{check.title}</span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {check.score}/{check.maxScore}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{check.message}</p>
                          {check.status !== 'passed' && (
                            <p className="text-[11px] text-indigo-700 font-medium mt-1">
                              Fix: {check.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Back to Resume Editor
          </button>
        </div>
      </div>
    </div>
  );
};
