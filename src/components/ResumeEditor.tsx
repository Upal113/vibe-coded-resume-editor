import React, { useState } from 'react';
import {
  ResumeData,
  WorkExperience,
  Project,
  Education,
  SkillCategory,
  Certification,
} from '../types/resume';
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenBulletEnhancer: (bulletText: string, onApply: (newText: string) => void) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  onChange,
  onOpenBulletEnhancer,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Contact update
  const handleContactChange = (field: keyof ResumeData['contact'], value: string) => {
    onChange({
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value,
      },
    });
  };

  // Experience updates
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Tech Solutions Inc.',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: 'Jan 2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected distributed microservices pipeline handling 50k+ daily transactions, reducing latency by 32%.',
      ],
    };
    onChange({
      ...resume,
      experience: [newExp, ...resume.experience],
    });
  };

  const handleUpdateExperience = (index: number, updated: WorkExperience) => {
    const next = [...resume.experience];
    next[index] = updated;
    onChange({ ...resume, experience: next });
  };

  const handleRemoveExperience = (index: number) => {
    const next = resume.experience.filter((_, i) => i !== index);
    onChange({ ...resume, experience: next });
  };

  // Project updates
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Technical Project',
      technologies: 'React, TypeScript, Node.js, PostgreSQL',
      link: 'github.com/username/project',
      startDate: '2023',
      endDate: '2024',
      bullets: [
        'Developed end-to-end full stack solution deployed with Docker, servicing 2,000+ weekly active users.',
      ],
    };
    onChange({
      ...resume,
      projects: [...resume.projects, newProj],
    });
  };

  const handleUpdateProject = (index: number, updated: Project) => {
    const next = [...resume.projects];
    next[index] = updated;
    onChange({ ...resume, projects: next });
  };

  const handleRemoveProject = (index: number) => {
    const next = resume.projects.filter((_, i) => i !== index);
    onChange({ ...resume, projects: next });
  };

  // Education updates
  const handleAddEducation = () => {
    const newEd: Education = {
      id: `ed-${Date.now()}`,
      institution: 'State University',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science',
      location: 'City, State',
      startDate: '2019',
      endDate: '2023',
      gpa: '3.8 / 4.0',
    };
    onChange({
      ...resume,
      education: [...resume.education, newEd],
    });
  };

  const handleUpdateEducation = (index: number, updated: Education) => {
    const next = [...resume.education];
    next[index] = updated;
    onChange({ ...resume, education: next });
  };

  const handleRemoveEducation = (index: number) => {
    const next = resume.education.filter((_, i) => i !== index);
    onChange({ ...resume, education: next });
  };

  // Skill Category updates
  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      category: 'Specialized Tools',
      skills: 'Docker, Kubernetes, Redis, GraphQL',
    };
    onChange({
      ...resume,
      skills: [...resume.skills, newCat],
    });
  };

  const handleUpdateSkillCategory = (index: number, updated: SkillCategory) => {
    const next = [...resume.skills];
    next[index] = updated;
    onChange({ ...resume, skills: next });
  };

  const handleRemoveSkillCategory = (index: number) => {
    const next = resume.skills.filter((_, i) => i !== index);
    onChange({ ...resume, skills: next });
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Contact Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('contact')}
          className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-semibold text-slate-800 border-b border-slate-200 transition"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Personal &amp; Contact Details</span>
          </div>
          {openSections.contact ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSections.contact && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={resume.contact.fullName}
                onChange={(e) => handleContactChange('fullName', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. Alex Vance"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Professional Title</label>
              <input
                type="text"
                value={resume.contact.title}
                onChange={(e) => handleContactChange('title', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={resume.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="alex.vance@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={resume.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Location (City, State / Country)</label>
              <input
                type="text"
                value={resume.contact.location}
                onChange={(e) => handleContactChange('location', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn URL / Handle</label>
              <input
                type="text"
                value={resume.contact.linkedin}
                onChange={(e) => handleContactChange('linkedin', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="linkedin.com/in/alexvance"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">GitHub Profile</label>
              <input
                type="text"
                value={resume.contact.github}
                onChange={(e) => handleContactChange('github', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="github.com/alexvance"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Portfolio or Website</label>
              <input
                type="text"
                value={resume.contact.portfolio}
                onChange={(e) => handleContactChange('portfolio', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="alexvance.dev"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-semibold text-slate-800 border-b border-slate-200 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-indigo-600 font-bold">¶</span>
            <span>Professional Summary</span>
          </div>
          {openSections.summary ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSections.summary && (
          <div className="p-5">
            <textarea
              rows={3}
              value={resume.summary}
              onChange={(e) => onChange({ ...resume, summary: e.target.value })}
              className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              placeholder="Concise 2-3 sentence overview highlighting years of experience, core technical stack, and measurable business impact..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Tip: Include your seniority, top languages/frameworks, and 1 high-impact metric.
            </p>
          </div>
        )}
      </div>

      {/* 3. Technical Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between font-semibold text-slate-800 border-b border-slate-200">
          <button
            onClick={() => toggleSection('skills')}
            className="flex items-center gap-2.5 hover:text-indigo-600 transition"
          >
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Technical Skills Taxonomy</span>
            <span className="text-xs font-normal text-slate-500">
              ({resume.skills.length} categories)
            </span>
          </button>
          <button
            onClick={handleAddSkillCategory}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Category
          </button>
        </div>

        {openSections.skills && (
          <div className="p-5 space-y-3">
            {resume.skills.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <div className="w-full sm:w-1/3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Category Header
                  </label>
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) =>
                      handleUpdateSkillCategory(idx, { ...cat, category: e.target.value })
                    }
                    className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Languages"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Skills (Comma Separated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cat.skills}
                      onChange={(e) =>
                        handleUpdateSkillCategory(idx, { ...cat, skills: e.target.value })
                      }
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. TypeScript, Python, Go, SQL"
                    />
                    <button
                      onClick={() => handleRemoveSkillCategory(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Work Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between font-semibold text-slate-800 border-b border-slate-200">
          <button
            onClick={() => toggleSection('experience')}
            className="flex items-center gap-2.5 hover:text-indigo-600 transition"
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Work Experience</span>
            <span className="text-xs font-normal text-slate-500">
              ({resume.experience.length} roles)
            </span>
          </button>
          <button
            onClick={handleAddExperience}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Role
          </button>
        </div>

        {openSections.experience && (
          <div className="p-5 space-y-6">
            {resume.experience.map((exp, expIdx) => (
              <div
                key={exp.id || expIdx}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Role #{expIdx + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveExperience(expIdx)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Role
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(expIdx, { ...exp, company: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        handleUpdateExperience(expIdx, { ...exp, role: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        handleUpdateExperience(expIdx, { ...exp, location: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleUpdateExperience(expIdx, { ...exp, startDate: e.target.value })
                        }
                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none"
                        placeholder="Aug 2021"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) =>
                          handleUpdateExperience(expIdx, { ...exp, endDate: e.target.value })
                        }
                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none disabled:bg-slate-100 text-slate-700"
                        placeholder="Present"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) =>
                      handleUpdateExperience(expIdx, {
                        ...exp,
                        current: e.target.checked,
                        endDate: e.target.checked ? 'Present' : '',
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-600 font-medium">
                    I currently work here
                  </label>
                </div>

                  {/* Bullets */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Accomplishment Bullets (STAR Method)
                    </span>
                    <button
                      onClick={() => {
                        const currentBullets = Array.isArray(exp.bullets) ? exp.bullets : [];
                        handleUpdateExperience(expIdx, {
                          ...exp,
                          bullets: [...currentBullets, 'Engineered new scalable feature, increasing efficiency by 25%.'],
                        });
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Bullet
                    </button>
                  </div>

                  {(Array.isArray(exp.bullets) ? exp.bullets : []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-2 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...exp.bullets];
                          newBullets[bIdx] = e.target.value;
                          handleUpdateExperience(expIdx, { ...exp, bullets: newBullets });
                        }}
                        className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Action verb + Context + Measurable result (e.g. Architected microservice, cutting latency by 40%)..."
                      />
                      <button
                        onClick={() =>
                          onOpenBulletEnhancer(bullet, (enhanced) => {
                            const newBullets = [...exp.bullets];
                            newBullets[bIdx] = enhanced;
                            handleUpdateExperience(expIdx, { ...exp, bullets: newBullets });
                          })
                        }
                        className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition mt-1"
                        title="AI / STAR Bullet Enhancer"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                          handleUpdateExperience(expIdx, { ...exp, bullets: newBullets });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition mt-1"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between font-semibold text-slate-800 border-b border-slate-200">
          <button
            onClick={() => toggleSection('projects')}
            className="flex items-center gap-2.5 hover:text-indigo-600 transition"
          >
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
            <span>Key Projects</span>
            <span className="text-xs font-normal text-slate-500">
              ({resume.projects.length} projects)
            </span>
          </button>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>

        {openSections.projects && (
          <div className="p-5 space-y-5">
            {resume.projects.map((proj, pIdx) => (
              <div
                key={proj.id || pIdx}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-700">Project #{pIdx + 1}</span>
                  <button
                    onClick={() => handleRemoveProject(pIdx)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) =>
                        handleUpdateProject(pIdx, { ...proj, title: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tech Stack</label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) =>
                        handleUpdateProject(pIdx, { ...proj, technologies: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                      placeholder="e.g. Go, Raft, gRPC, Redis"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Link / Demo</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) =>
                        handleUpdateProject(pIdx, { ...proj, link: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                      placeholder="github.com/user/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Dates</label>
                    <input
                      type="text"
                      value={`${proj.startDate || ''} - ${proj.endDate || ''}`}
                      onChange={(e) => {
                        const [start, end] = e.target.value.split('-').map((s) => s.trim());
                        handleUpdateProject(pIdx, {
                          ...proj,
                          startDate: start || '',
                          endDate: end || '',
                        });
                      }}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                      placeholder="Jan 2023 - Apr 2023"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-1">
                  {(Array.isArray(proj.bullets) ? proj.bullets : []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-2 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const currentB = Array.isArray(proj.bullets) ? proj.bullets : [];
                          const newB = [...currentB];
                          newB[bIdx] = e.target.value;
                          handleUpdateProject(pIdx, { ...proj, bullets: newB });
                        }}
                        className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          onOpenBulletEnhancer(bullet, (enhanced) => {
                            const newB = [...proj.bullets];
                            newB[bIdx] = enhanced;
                            handleUpdateProject(pIdx, { ...proj, bullets: newB });
                          })
                        }
                        className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition mt-1"
                        title="AI / STAR Bullet Enhancer"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Education */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between font-semibold text-slate-800 border-b border-slate-200">
          <button
            onClick={() => toggleSection('education')}
            className="flex items-center gap-2.5 hover:text-indigo-600 transition"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Education</span>
            <span className="text-xs font-normal text-slate-500">
              ({resume.education.length} entries)
            </span>
          </button>
          <button
            onClick={handleAddEducation}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Degree
          </button>
        </div>

        {openSections.education && (
          <div className="p-5 space-y-4">
            {resume.education.map((ed, edIdx) => (
              <div
                key={ed.id || edIdx}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-700">Degree #{edIdx + 1}</span>
                  <button
                    onClick={() => handleRemoveEducation(edIdx)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={ed.institution}
                      onChange={(e) =>
                        handleUpdateEducation(edIdx, { ...ed, institution: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Degree Title</label>
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) =>
                        handleUpdateEducation(edIdx, { ...ed, degree: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                      placeholder="B.S. in Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Dates</label>
                    <input
                      type="text"
                      value={`${ed.startDate} - ${ed.endDate}`}
                      onChange={(e) => {
                        const [s, end] = e.target.value.split('-').map((v) => v.trim());
                        handleUpdateEducation(edIdx, {
                          ...ed,
                          startDate: s || '',
                          endDate: end || '',
                        });
                      }}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">GPA (Optional)</label>
                    <input
                      type="text"
                      value={ed.gpa || ''}
                      onChange={(e) =>
                        handleUpdateEducation(edIdx, { ...ed, gpa: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                      placeholder="e.g. 3.85 / 4.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relevant Coursework</label>
                  <input
                    type="text"
                    value={ed.coursework || ''}
                    onChange={(e) =>
                      handleUpdateEducation(edIdx, { ...ed, coursework: e.target.value })
                    }
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                    placeholder="Algorithms, Operating Systems, Database Systems, Cloud Computing"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
