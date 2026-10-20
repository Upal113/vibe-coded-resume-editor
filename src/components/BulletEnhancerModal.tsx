import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, TrendingUp, Cpu, DollarSign } from 'lucide-react';
import { enhanceBulletPoint, BulletSuggestion } from '../services/bulletEnhancer';

interface BulletEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  onApply: (newBullet: string) => void;
}

export const BulletEnhancerModal: React.FC<BulletEnhancerModalProps> = ({
  isOpen,
  onClose,
  originalBullet,
  onApply,
}) => {
  const suggestions: BulletSuggestion[] = React.useMemo(
    () => enhanceBulletPoint(originalBullet || ''),
    [originalBullet]
  );
  const [selectedText, setSelectedText] = useState(
    suggestions[0]?.text || originalBullet || ''
  );

  React.useEffect(() => {
    setSelectedText(suggestions[0]?.text || originalBullet || '');
  }, [suggestions, originalBullet]);

  if (!isOpen) return null;

  const getMetricIcon = (type: string) => {
    if (type.includes('Performance') || type.includes('Latency')) return TrendingUp;
    if (type.includes('Cost') || type.includes('Savings')) return DollarSign;
    return Cpu;
  };

  const handleApply = (text: string) => {
    onApply(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">STAR Bullet Point Enhancer</h2>
              <p className="text-xs text-slate-400">
                Transform passive statements into quantified high-impact accomplishments
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
          {/* Original */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-600 uppercase tracking-wide block mb-1">
              Current Bullet Point:
            </span>
            <p className="text-slate-800 italic">"{originalBullet || 'No bullet text provided'}"</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
              Choose High-Impact STAR Variations:
            </span>

            {suggestions.map((sug, i) => {
              const Icon = getMetricIcon(sug.metricType);
              const isSelected = selectedText === sug.text;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedText(sug.text)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{sug.metricType}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {sug.actionVerb}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(sug.text);
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shadow-sm transition"
                    >
                      <Check className="w-3 h-3" />
                      Apply
                    </button>
                  </div>

                  <p className="text-xs text-slate-900 leading-relaxed font-medium">{sug.text}</p>
                  <p className="text-[11px] text-slate-500">{sug.rationale}</p>
                </div>
              );
            })}
          </div>

          {/* Custom Editable Output */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Selected / Custom Edit Before Applying:
            </label>
            <textarea
              rows={3}
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApply(selectedText)}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow"
          >
            Apply to Resume
          </button>
        </div>
      </div>
    </div>
  );
};
