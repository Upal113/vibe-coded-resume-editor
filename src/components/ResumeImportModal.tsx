import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ResumeData } from '../types/resume';
import { extractTextFromPdf } from '../services/pdfExtractor';
import { parseResumeText } from '../services/resumeParser';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (resume: ResumeData) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const parsedPreview = React.useMemo(() => {
    if (!rawText.trim()) return null;
    try {
      return parseResumeText(rawText);
    } catch {
      return null;
    }
  }, [rawText]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setIsLoading(true);

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // True binary PDF extraction using PDF.js
        const result = await extractTextFromPdf(file);
        if (!result.fullText || result.fullText.trim().length === 0) {
          throw new Error(
            'No readable text could be extracted from this PDF. It may be a scanned image without an OCR text layer.'
          );
        }
        setRawText(result.fullText);
        setPageCount(result.pageCount);
      } else {
        // Text / plain text file
        const text = await file.text();
        setRawText(text);
        setPageCount(1);
      }
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setParseError(
        err.message || 'Failed to read PDF. Please ensure the file is an uncorrupted PDF document.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (parsedPreview) {
      onImport(parsedPreview);
      onClose();
    }
  };

  const loadSamplePdfText = () => {
    const sample = `John Doe
Senior Distributed Systems Engineer
john.doe@example.com | +1 (555) 345-6789 | San Francisco, CA
linkedin.com/in/johndoe | github.com/johndoe

Professional Summary
Senior Software Engineer with 7 years of experience building resilient microservices, distributed data processing systems, and high-throughput real-time APIs.

Work Experience
Senior Backend Engineer
Stripe - San Francisco, CA
Jan 2021 – Present
• Architected high-availability payments settlement engine processing $40M+ in daily transaction volume with 99.999% uptime.
• Reduced API P99 latency by 45% by redesigning cache invalidation strategies using Redis clusters and Go channels.
• Spearheaded migration of 14 database tables to partitioned PostgreSQL, decreasing query execution times by 3.8x.

Software Engineer
Uber - Seattle, WA
Jun 2018 – Dec 2020
• Engineered real-time dispatch matching microservice handling 80,000 requests/sec with Apache Kafka and Go.
• Automated canary rollout pipeline with Kubernetes and Docker, cutting deployment failure rate by 60%.

Education
University of Washington - Seattle, WA
Bachelor of Science in Computer Science
2014 – 2018
GPA: 3.9 / 4.0

Technical Skills
Languages: Go, TypeScript, Python, SQL, C++, Java
Frameworks & Databases: Node.js, React, PostgreSQL, Redis, Apache Kafka, GraphQL
Cloud & DevOps: AWS (ECS, Lambda, S3), Kubernetes, Docker, Terraform, CI/CD

Projects
RaftKV | github.com/johndoe/raftkv
• Built high-performance distributed key-value store implementing the Raft consensus algorithm from scratch in Go.`;
    setRawText(sample);
    setFileName('sample_tech_resume.pdf');
    setPageCount(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">PDF &amp; Resume Text Parser</h3>
              <p className="text-xs text-slate-400">
                Extract text streams from PDF files and auto-populate the LaTeX ATS builder
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* File Upload Dropzone */}
          <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/40 transition text-center group">
            {isLoading ? (
              <div className="flex flex-col items-center py-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <span className="text-xs font-semibold text-slate-800">
                  Extracting PDF text layer &amp; font coordinates...
                </span>
                <span className="text-[11px] text-slate-500">
                  Parsing stream objects with PDF.js engine
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {fileName ? fileName : 'Upload your Resume PDF or Document'}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  Supports PDF (.pdf), Word (.docx), or text (.txt)
                </span>
                {pageCount && (
                  <span className="mt-1 text-[11px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    ✓ Successfully read {pageCount} page(s)
                  </span>
                )}
              </div>
            )}
            <input
              type="file"
              accept=".pdf,.txt,.docx,.doc"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>

          {/* Quick sample button */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Want to test parsing right away?</span>
            <button
              onClick={loadSamplePdfText}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample Senior Engineer PDF Text
            </button>
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Extraction Warning: </span>
                <span>{parseError}</span>
              </div>
            </div>
          )}

          {/* Extracted Text Viewer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Extracted Text Stream
              </label>
              {rawText && (
                <span className="text-[11px] text-slate-500 font-mono">
                  {rawText.length} characters • {rawText.split(/\s+/).filter(Boolean).length} words
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Extracted PDF text will appear here. You can also paste your resume text directly..."
              className="w-full text-xs p-3 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Parsed Structure Preview */}
          {parsedPreview && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recognized ATS Sections Preview
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                  Ready to Import
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Full Name</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {parsedPreview.contact.fullName || '—'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Contact</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {parsedPreview.contact.email || parsedPreview.contact.phone || '—'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Work Roles</span>
                  <span className="font-bold text-slate-800 block">
                    {parsedPreview.experience.length} roles found
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Skills Categories</span>
                  <span className="font-bold text-slate-800 block">
                    {parsedPreview.skills.length} categories
                  </span>
                </div>
              </div>

              {parsedPreview.experience.length > 0 && (
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800">First Role Detected: </span>
                  <span>
                    {parsedPreview.experience[0].role} at {parsedPreview.experience[0].company} ({parsedPreview.experience[0].startDate} – {parsedPreview.experience[0].endDate})
                  </span>
                  <span className="block text-slate-500 mt-0.5">
                    ({parsedPreview.experience[0].bullets.length} accomplishment bullets extracted)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedPreview}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition shadow flex items-center gap-1.5"
          >
            <span>Populate LaTeX Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
