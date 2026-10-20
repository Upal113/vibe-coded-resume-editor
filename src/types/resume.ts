export interface ResumeContact {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string; // e.g. "Languages", "Frameworks & Tools", "Cloud & DevOps"
  skills: string; // comma separated or list
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  skills: SkillCategory[];
  experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export interface AtsCheckItem {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0 to max
  maxScore: number;
  message: string;
  suggestion: string;
}

export interface AtsScoreResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  categories: {
    formatting: { score: number; maxScore: number; checks: AtsCheckItem[] };
    impactMetrics: { score: number; maxScore: number; checks: AtsCheckItem[] };
    skillsRelevance: { score: number; maxScore: number; checks: AtsCheckItem[] };
    structureCompleteness: { score: number; maxScore: number; checks: AtsCheckItem[] };
    contentQuality: { score: number; maxScore: number; checks: AtsCheckItem[] };
  };
  actionVerbCount: number;
  quantifiedBulletCount: number;
  totalBulletCount: number;
  identifiedKeywords: string[];
  recommendations: string[];
}

export interface JdMatchResult {
  matchScore: number;
  totalJdKeywords: number;
  matchedCount: number;
  missingCount: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  criticalKeywords: string[];
  recommendations: string[];
}

export type ResumeTemplateId = 'jake' | 'classic' | 'modern' | 'minimal';
