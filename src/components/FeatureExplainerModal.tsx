import React from 'react';
import {
  X,
  FileCode,
  ShieldCheck,
  Target,
  Sparkles,
  Upload,
  Download,
  CheckCircle2,
  Cpu,
  Layers,
  BarChart,
  HelpCircle,
} from 'lucide-react';

interface FeatureExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureExplainerModal: React.FC<FeatureExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      title: '1. Professional LaTeX-Style Resume Builder',
      icon: FileCode,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      description:
        'Engineers and tech professionals prefer LaTeX for its clean typesetting, standard margins, and mathematical precision. PushResume provides a web-based builder patterned on the industry-standard "Jake\'s Resume" Overleaf template, guaranteeing clean single-column hierarchy without needing a local TeX distribution.',
      highlights: [
        'Single-column linear parsing structure (zero column-scramble in ATS)',
        'Small-caps section headers with horizontal rule accents',
        'Standard LaTeX margin proportions (0.5in - 0.75in)',
        'Right-aligned employment dates and company locations',
      ],
    },
    {
      title: '2. Real-Time ATS Scoring & Diagnostic Auditor',
      icon: ShieldCheck,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      description:
        'PushResume simulates how enterprise applicant tracking software (Workday, Greenhouse, Lever, iCIMS) parses and scores incoming CVs before a human recruiter ever sees them.',
      highlights: [
        'Calculates 0-100 overall score with letter grade (A+ through F)',
        'Audits percentage of bullets with quantifiable metrics (%, $, scale)',
        'Detects strong STAR action verbs vs weak passive phrases ("responsible for")',
        'Verifies core section taxonomy and contact coordinates',
      ],
    },
    {
      title: '3. Job Description (JD) Optimizer & Keyword Gap Matcher',
      icon: Target,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      description:
        'Employers filter resumes based on keyword match density against their specific job post. Users paste a target job description to instantly uncover missing hard skills and competencies.',
      highlights: [
        'Automated extraction of technical skills, frameworks, and tools from JD',
        'Live Match Rate percentage calculation',
        'Visual keyword gap matrix: Matched (green) vs Missing (red)',
        'One-click injection of missing high-value keywords directly into resume skills',
      ],
    },
    {
      title: '4. Free Resume Review & Actionable Feedback',
      icon: BarChart,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      description:
        'PushResume provides instant automated resume reviews to help job seekers identify blind spots before submitting applications to high-volume recruitment pipelines.',
      highlights: [
        'Prioritized recommendations list (Top 3-5 immediate fixes)',
        'Bullet length density checker (flags sub-optimal 5-word or 50-word bullets)',
        'Hard skills taxonomy categorization (Languages, Frameworks, Cloud, Tools)',
      ],
    },
    {
      title: '5. Multi-Format Upload & Ingestion',
      icon: Upload,
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
      description:
        'Supports uploading existing resumes via PDF, DOCX, or plain text / raw paste to quickly extract sections and populate the LaTeX editor.',
      highlights: [
        'Fast parsing of contact information, work experience, and education',
        'Text extraction with zero formatting artifact retention',
        'Quick-load presets for standard tech disciplines (SWE, ML/AI)',
      ],
    },
    {
      title: '6. Compilable LaTeX Source & PDF Export',
      icon: Download,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
      description:
        'Unlike closed-source graphic builders (Canva, Photoshop) that output rasterized or complex vector PDFs unreadable by ATS parsers, PushResume exports pure, clean LaTeX (.tex) code and print-ready PDF.',
      highlights: [
        'Generates standard Overleaf-ready LaTeX code with \\pdfgentounicode=1',
        'Direct in-browser printable PDF export preserving exact vector glyphs',
        'Complete user data privacy and local browser portability',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">PushResume.net Feature Analysis</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                Full Breakdown
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive breakdown of PushResume's core architecture, features, and ATS compliance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-5 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              What is PushResume?
            </h3>
            <p>
              <strong>PushResume</strong> (accessible at <code className="text-indigo-700 font-mono">pushresume.net</code>) is an ATS-first resume builder and diagnostic audit platform. Rather than building multi-column, icon-heavy resumes (which frequently fail applicant tracking systems like Workday, Greenhouse, and Taleo), PushResume builds clean, <strong>professional LaTeX-style single-column resumes</strong> with built-in <strong>real-time ATS scoring</strong> and <strong>Job Description (JD) keyword optimization</strong>.
            </p>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-lg border ${feat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{feat.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {feat.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* LaTeX vs Traditional Builder Comparison */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Why LaTeX Formatting Dominates Technical ATS Screening
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-1.5">
                <span className="font-bold text-emerald-400 block">PushResume LaTeX Standard</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Pure linear text stream; zero tables or unparseable columns</li>
                  <li>• Embedded fonts with native ASCII/Unicode character layers</li>
                  <li>• Standard section headings recognized by all parser schemas</li>
                  <li>• 100% accepted by top tech firms (FAANG, unicorns, finance)</li>
                </ul>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-1.5">
                <span className="font-bold text-rose-400 block">Ordinary Graphic Builders (Canva / Word)</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li>• Two-column tables scramble reading order in Workday</li>
                  <li>• Icons/graphics turn into garbage characters during OCR</li>
                  <li>• Custom colored text boxes frequently ignored by spiders</li>
                  <li>• High ATS rejection rates before recruiter review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">
            PushResume Interactive Engine Running Live
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow"
          >
            Explore Live Builder
          </button>
        </div>
      </div>
    </div>
  );
};
