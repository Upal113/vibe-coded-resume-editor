import React, { useState } from 'react';
import { ResumeData, ResumeTemplateId } from '../types/resume';
import { ZoomIn, ZoomOut, RotateCcw, CheckCircle, ShieldCheck } from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeData;
  template: ResumeTemplateId;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, template }) => {
  const [zoom, setZoom] = useState(100);

  const getFontFamily = () => {
    switch (template) {
      case 'classic':
        return 'font-latex text-slate-900';
      case 'modern':
        return 'font-sans text-slate-900';
      case 'minimal':
        return 'font-sans text-slate-900';
      case 'jake':
      default:
        return 'font-latex text-slate-900';
    }
  };

  const getSectionHeaderClass = () => {
    switch (template) {
      case 'modern':
        return 'uppercase tracking-wider text-xs font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2';
      case 'minimal':
        return 'tracking-wide text-xs font-semibold text-slate-800 border-b border-slate-200 pb-0.5 mb-2';
      case 'classic':
      case 'jake':
      default:
        // Jake's Resume Overleaf style: small-caps with crisp rule
        return 'uppercase tracking-widest text-[13px] font-bold text-black border-b-[1.5px] border-black pb-0.5 mb-2.5';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Zoom and status toolbar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 rounded-t-xl border border-slate-300 text-xs text-slate-600 mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">ATS Single-Column Format</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
            pdflatex compliant
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(60, z - 10))}
            className="p-1 hover:bg-slate-200 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-mono font-medium">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(140, z + 10))}
            className="p-1 hover:bg-slate-200 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 hover:bg-slate-200 rounded transition ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sheet Container with zoom scaling */}
      <div className="w-full overflow-x-auto flex justify-center py-4 bg-slate-200/70 rounded-b-xl border border-t-0 border-slate-300">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150"
        >
          {/* Printable Sheet: standard 8.5" x 11" US Letter proportions */}
          <div
            id="resume-preview"
            className={`w-[816px] min-h-[1056px] bg-white text-black shadow-2xl p-[0.55in] leading-normal select-text ${getFontFamily()}`}
          >
            {/* 1. Header / Contact (Jake's Resume Center aligned) */}
            <div className="text-center mb-4">
              <h1 className="text-[26px] font-bold tracking-tight text-black mb-1">
                {resume.contact.fullName || 'Your Full Name'}
              </h1>

              <div className="text-[12.5px] text-slate-800 flex flex-wrap items-center justify-center gap-1.5 leading-snug">
                {resume.contact.phone && <span>{resume.contact.phone}</span>}
                {resume.contact.phone && resume.contact.email && <span>|</span>}
                {resume.contact.email && (
                  <span className="text-indigo-900 underline decoration-indigo-300">
                    {resume.contact.email}
                  </span>
                )}
                {resume.contact.linkedin && <span>|</span>}
                {resume.contact.linkedin && (
                  <span className="text-indigo-900 underline decoration-indigo-300">
                    {resume.contact.linkedin}
                  </span>
                )}
                {resume.contact.github && <span>|</span>}
                {resume.contact.github && (
                  <span className="text-indigo-900 underline decoration-indigo-300">
                    {resume.contact.github}
                  </span>
                )}
                {resume.contact.portfolio && <span>|</span>}
                {resume.contact.portfolio && (
                  <span className="text-indigo-900 underline decoration-indigo-300">
                    {resume.contact.portfolio}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Professional Summary (Optional) */}
            {resume.summary && (
              <div className="mb-4">
                <h2 className={getSectionHeaderClass()}>Professional Summary</h2>
                <p className="text-[12.5px] text-slate-800 leading-relaxed text-justify">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* 3. Education (Jake's places Education before or after experience) */}
            {resume.education && resume.education.length > 0 && (
              <div className="mb-4">
                <h2 className={getSectionHeaderClass()}>Education</h2>
                <div className="space-y-2">
                  {resume.education.map((ed) => (
                    <div key={ed.id} className="text-[12.5px]">
                      <div className="flex justify-between items-baseline font-bold text-black">
                        <span>{ed.institution}</span>
                        <span className="font-normal text-slate-700">{ed.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-slate-800">
                        <span>
                          {ed.degree}
                          {ed.gpa && (
                            <span className="not-italic text-slate-700 font-medium ml-1">
                              • GPA: {ed.gpa}
                            </span>
                          )}
                        </span>
                        <span className="not-italic text-slate-700 text-xs">
                          {ed.startDate} – {ed.endDate}
                        </span>
                      </div>
                      {ed.coursework && (
                        <p className="text-[11.5px] text-slate-700 mt-0.5">
                          <span className="font-semibold text-slate-800">Coursework:</span>{' '}
                          {ed.coursework}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="mb-4">
                <h2 className={getSectionHeaderClass()}>Experience</h2>
                <div className="space-y-3">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="text-[12.5px]">
                      <div className="flex justify-between items-baseline font-bold text-black">
                        <span>{exp.role}</span>
                        <span className="font-normal text-slate-700 text-xs">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-slate-800 mb-1">
                        <span>{exp.company}</span>
                        <span className="not-italic text-slate-700 text-xs">{exp.location}</span>
                      </div>

                      <ul className="list-disc ml-5 space-y-1 text-[12px] text-slate-800 leading-snug">
                        {(Array.isArray(exp?.bullets) ? exp.bullets : [])
                          .filter((b) => typeof b === 'string' && b.trim().length > 0)
                          .map((bullet, idx) => (
                            <li key={idx} className="pl-0.5">
                              {bullet}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Projects */}
            {Array.isArray(resume.projects) && resume.projects.length > 0 && (
              <div className="mb-4">
                <h2 className={getSectionHeaderClass()}>Projects</h2>
                <div className="space-y-2.5">
                  {resume.projects.map((proj) => (
                    <div key={proj.id} className="text-[12.5px]">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold text-black">{proj.title}</span>
                          {proj.technologies && (
                            <span className="italic text-slate-700 ml-1.5">
                              | {proj.technologies}
                            </span>
                          )}
                          {proj.link && (
                            <span className="text-indigo-900 underline text-xs ml-1.5">
                              | {proj.link}
                            </span>
                          )}
                        </div>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-slate-700 text-xs whitespace-nowrap ml-2">
                            {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                          </span>
                        )}
                      </div>

                      <ul className="list-disc ml-5 space-y-0.5 text-[12px] text-slate-800 leading-snug mt-0.5">
                        {(Array.isArray(proj?.bullets) ? proj.bullets : [])
                          .filter((b) => typeof b === 'string' && b.trim().length > 0)
                          .map((bullet, idx) => (
                            <li key={idx} className="pl-0.5">
                              {bullet}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Technical Skills */}
            {Array.isArray(resume.skills) && resume.skills.length > 0 && (
              <div className="mb-4">
                <h2 className={getSectionHeaderClass()}>Technical Skills</h2>
                <div className="space-y-1 text-[12.5px] leading-relaxed">
                  {resume.skills.map((cat) => (
                    <div key={cat.id} className="text-slate-800">
                      <span className="font-bold text-black">{cat.category}: </span>
                      <span>{cat.skills}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Certifications (if any) */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="mb-2">
                <h2 className={getSectionHeaderClass()}>Certifications &amp; Credentials</h2>
                <div className="space-y-1 text-[12.5px]">
                  {resume.certifications.map((c) => (
                    <div key={c.id} className="flex justify-between text-slate-800">
                      <span>
                        <strong className="text-black">{c.name}</strong> – {c.issuer}
                      </span>
                      <span className="text-slate-600 text-xs">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
