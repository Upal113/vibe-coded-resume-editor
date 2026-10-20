import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, ExternalLink } from 'lucide-react';

interface LatexCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  latexCode: string;
}

export const LatexCodeModal: React.FC<LatexCodeModalProps> = ({ isOpen, onClose, latexCode }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">PushResume LaTeX Source Code</h2>
              <p className="text-xs text-slate-400">
                Overleaf and pdflatex compatible LaTeX document (Jake's standard ATS preamble)
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
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Format:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono">
                article (letterpaper, 11pt)
              </code>
              <span className="text-slate-500">• glyphtounicode enabled for ATS parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .tex</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed select-all">
              {latexCode}
            </pre>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-xs text-cyan-900">
            <p className="font-semibold mb-1">How to compile in Overleaf or TeX Live:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-cyan-800">
              <li>Open Overleaf.com and create a "New Project" &gt; "Blank Project".</li>
              <li>Replace the contents of <code>main.tex</code> with this code.</li>
              <li>Press "Recompile" (ensure compiler is set to pdfLaTeX).</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
