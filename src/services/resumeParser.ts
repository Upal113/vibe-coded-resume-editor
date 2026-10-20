import {
  ResumeData,
  WorkExperience,
  Project,
  Education,
  SkillCategory,
  Certification,
} from '../types/resume';

const SECTION_HEADERS = {
  summary: /^(?:professional\s+)?(?:summary|profile|about(?:\s+me)?|objective)\b/i,
  experience: /^(?:work\s+|professional\s+)?(?:experience|employment(?:\s+history)?|work\s+history)\b/i,
  education: /^(?:education|academic(?:\s+background|\s+history)?|degrees)\b/i,
  skills: /^(?:technical\s+|core\s+)?(?:skills|technologies|competencies|tech\s+stack)\b/i,
  projects: /^(?:key\s+|technical\s+|personal\s+)?(?:projects|portfolio)\b/i,
  certifications: /^(?:certifications?|licenses(?:\s+&\s+certifications?)?|certificates?)\b/i,
};

const DATE_RANGE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—]\s*(?:Present|Current|Ongoing|\d{4}|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4})/i;

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
const URL_REGEX = /(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:dev|io|com|me|net|org)(?:\/[a-zA-Z0-9_-]+)*)/i;
const LOCATION_REGEX = /\b([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}(?:\s+\d{5})?|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z]+)\b/;

export function sanitizeResume(data: any): ResumeData {
  if (!data || typeof data !== 'object') {
    data = {};
  }

  const contact = data.contact || {};
  const sanitizedContact = {
    fullName: String(contact.fullName || 'Candidate Name'),
    title: String(contact.title || 'Software Professional'),
    email: String(contact.email || ''),
    phone: String(contact.phone || ''),
    location: String(contact.location || ''),
    linkedin: String(contact.linkedin || ''),
    github: String(contact.github || ''),
    portfolio: String(contact.portfolio || ''),
  };

  const skills: SkillCategory[] = Array.isArray(data.skills)
    ? data.skills.map((s: any, idx: number) => ({
        id: String(s?.id || `sk-${idx}`),
        category: String(s?.category || 'Technical Skills'),
        skills: String(s?.skills || ''),
      }))
    : [
        {
          id: 'sk-1',
          category: 'Technical Skills',
          skills: 'TypeScript, JavaScript, Python, SQL, Git, Cloud Platforms',
        },
      ];

  const experience: WorkExperience[] = Array.isArray(data.experience)
    ? data.experience.map((e: any, idx: number) => ({
        id: String(e?.id || `exp-${idx}`),
        company: String(e?.company || 'Company'),
        role: String(e?.role || 'Engineer'),
        location: String(e?.location || ''),
        startDate: String(e?.startDate || '2021'),
        endDate: String(e?.endDate || 'Present'),
        current: Boolean(e?.current ?? true),
        bullets: Array.isArray(e?.bullets)
          ? e.bullets.map((b: any) => String(b || '')).filter((b: string) => b.trim().length > 0)
          : [],
      }))
    : [];

  const projects: Project[] = Array.isArray(data.projects)
    ? data.projects.map((p: any, idx: number) => ({
        id: String(p?.id || `proj-${idx}`),
        title: String(p?.title || 'Project'),
        technologies: String(p?.technologies || ''),
        link: p?.link ? String(p.link) : undefined,
        startDate: p?.startDate ? String(p.startDate) : undefined,
        endDate: p?.endDate ? String(p.endDate) : undefined,
        bullets: Array.isArray(p?.bullets)
          ? p.bullets.map((b: any) => String(b || '')).filter((b: string) => b.trim().length > 0)
          : [],
      }))
    : [];

  const education: Education[] = Array.isArray(data.education)
    ? data.education.map((ed: any, idx: number) => ({
        id: String(ed?.id || `ed-${idx}`),
        institution: String(ed?.institution || 'University'),
        degree: String(ed?.degree || 'Bachelor Degree'),
        fieldOfStudy: String(ed?.fieldOfStudy || 'Computer Science'),
        location: String(ed?.location || ''),
        startDate: String(ed?.startDate || '2018'),
        endDate: String(ed?.endDate || '2022'),
        gpa: ed?.gpa ? String(ed.gpa) : undefined,
        coursework: ed?.coursework ? String(ed.coursework) : undefined,
      }))
    : [];

  const certifications: Certification[] = Array.isArray(data.certifications)
    ? data.certifications.map((c: any, idx: number) => ({
        id: String(c?.id || `cert-${idx}`),
        name: String(c?.name || 'Certification'),
        issuer: String(c?.issuer || 'Accreditation'),
        date: String(c?.date || '2023'),
        credentialId: c?.credentialId ? String(c.credentialId) : undefined,
      }))
    : [];

  return {
    contact: sanitizedContact,
    summary: String(data.summary || ''),
    skills: skills.length > 0 ? skills : [{ id: 'sk-1', category: 'Skills', skills: 'Languages, Tools' }],
    experience,
    projects,
    education,
    certifications,
  };
}

export function parseResumeText(rawText: string): ResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Extract Contact Info
  let fullName = '';
  let title = 'Software Professional';
  let email = '';
  let phone = '';
  let location = '';
  let linkedin = '';
  let github = '';
  let portfolio = '';

  const emailMatch = rawText.match(EMAIL_REGEX);
  if (emailMatch) email = emailMatch[0];

  const phoneMatch = rawText.match(PHONE_REGEX);
  if (phoneMatch) phone = phoneMatch[0];

  const linkedinMatch = rawText.match(LINKEDIN_REGEX);
  if (linkedinMatch) linkedin = linkedinMatch[0].replace(/^https?:\/\//, '');

  const githubMatch = rawText.match(GITHUB_REGEX);
  if (githubMatch) github = githubMatch[0].replace(/^https?:\/\//, '');

  const locMatch = rawText.match(LOCATION_REGEX);
  if (locMatch) location = locMatch[0].trim();

  // Find candidate name (usually the first prominent non-header, non-contact line)
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.match(PHONE_REGEX) &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum vitae') &&
      !line.toLowerCase().includes('page') &&
      line.length >= 2 &&
      line.length <= 40 &&
      !line.includes('•') &&
      !line.includes('|')
    ) {
      fullName = line;
      // If the next line looks like a title, save it
      if (
        lines[i + 1] &&
        !lines[i + 1].includes('@') &&
        !lines[i + 1].match(PHONE_REGEX) &&
        lines[i + 1].length < 45
      ) {
        title = lines[i + 1];
      }
      break;
    }
  }

  if (!fullName && lines.length > 0) {
    fullName = lines[0];
  }

  // 2. Partition into Sections
  type SectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'unknown';
  const sectionContent: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    unknown: [],
  };

  let currentSection: SectionKey = 'unknown';

  for (const line of lines) {
    const isHeader = Object.entries(SECTION_HEADERS).find(([_, regex]) => regex.test(line));

    if (isHeader) {
      currentSection = isHeader[0] as SectionKey;
      continue;
    }

    if (currentSection !== 'unknown') {
      sectionContent[currentSection].push(line);
    } else {
      // Before any detected header: if not contact info, could be early summary
      if (
        line !== fullName &&
        line !== title &&
        !line.includes('@') &&
        !line.match(PHONE_REGEX) &&
        line.length > 50
      ) {
        sectionContent.summary.push(line);
      }
    }
  }

  // 3. Process Summary
  const summary = sectionContent.summary.join(' ').trim();

  // 4. Process Skills
  const skillsList: SkillCategory[] = [];
  if (sectionContent.skills.length > 0) {
    const skillLines = sectionContent.skills;
    let foundCategorized = false;

    skillLines.forEach((sLine, idx) => {
      // Check for "Languages: Python, Go..." pattern
      const colonMatch = sLine.match(/^([^:]+):\s*(.+)$/);
      if (colonMatch) {
        foundCategorized = true;
        skillsList.push({
          id: `sk-${idx}`,
          category: colonMatch[1].trim(),
          skills: colonMatch[2].trim(),
        });
      }
    });

    if (!foundCategorized) {
      // If lines are comma-separated or list of terms
      const allTokens = skillLines.join(', ').split(/[,•|·]/).map((s) => s.trim()).filter((s) => s.length > 1);
      skillsList.push({
        id: 'sk-1',
        category: 'Technical Skills',
        skills: allTokens.slice(0, 15).join(', '),
      });
      if (allTokens.length > 15) {
        skillsList.push({
          id: 'sk-2',
          category: 'Tools & Platforms',
          skills: allTokens.slice(15, 30).join(', '),
        });
      }
    }
  }

  if (skillsList.length === 0) {
    skillsList.push({
      id: 'sk-default',
      category: 'Core Competencies',
      skills: 'TypeScript, JavaScript, Python, SQL, Git, Cloud Platforms, System Design',
    });
  }

  // 5. Process Work Experience
  const experienceList: WorkExperience[] = [];
  if (sectionContent.experience.length > 0) {
    const expLines = sectionContent.experience;
    let currentExp: WorkExperience | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const dateMatch = line.match(DATE_RANGE_REGEX);

      // A role heading often has a date range or title/company
      if (dateMatch || (currentExp === null && !line.startsWith('•') && !line.startsWith('-'))) {
        if (currentExp && currentExp.bullets.length > 0) {
          experienceList.push(currentExp);
        }

        const dates = dateMatch ? dateMatch[0] : '';
        const isCurrent = /present|current|ongoing/i.test(dates);
        const [start, end] = dates.split(/[-–—]/).map((d) => d.trim());

        const cleanedHeading = line.replace(DATE_RANGE_REGEX, '').trim().replace(/^[|•-]\s*/, '');
        // Split by delimiter if company and role are on one line
        const parts = cleanedHeading.split(/\s+[-|–—]\s+|\s+at\s+/i);
        const role = parts[0] || 'Software Engineer';
        const company = parts[1] || (expLines[i + 1] && !expLines[i + 1].startsWith('•') ? expLines[i + 1] : 'Enterprise Corp');

        currentExp = {
          id: `exp-${experienceList.length + 1}`,
          role: role.trim(),
          company: company.trim(),
          location: 'Remote / Hybrid',
          startDate: start || '2021',
          endDate: isCurrent ? 'Present' : end || '2023',
          current: isCurrent,
          bullets: [],
        };
      } else if (currentExp) {
        // Bullet point
        const cleanBullet = line.replace(/^[•\-\*–>]\s*/, '').trim();
        if (cleanBullet.length > 10) {
          currentExp.bullets.push(cleanBullet);
        }
      }
    }

    if (currentExp && currentExp.bullets.length > 0) {
      experienceList.push(currentExp);
    }
  }

  // Fallback experience if parsing failed to isolate roles
  if (experienceList.length === 0 && sectionContent.experience.length > 0) {
    experienceList.push({
      id: 'exp-1',
      company: 'Primary Employer',
      role: title || 'Senior Software Engineer',
      location: location || 'United States',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      bullets: sectionContent.experience.slice(0, 4).map((b) => b.replace(/^[•\-\*]\s*/, '').trim()).filter((b) => b.length > 15),
    });
  }

  // 6. Process Education
  const educationList: Education[] = [];
  if (sectionContent.education.length > 0) {
    const edLines = sectionContent.education;
    let institution = '';
    let degree = '';
    let dates = '2018 - 2022';
    let gpa = '';

    for (const line of edLines) {
      if (/university|college|institute|school|academy/i.test(line)) {
        institution = line.replace(DATE_RANGE_REGEX, '').trim();
      }
      if (/bachelor|master|b\.s|m\.s|ph\.d|associate|degree/i.test(line)) {
        degree = line.replace(DATE_RANGE_REGEX, '').trim();
      }
      const dateMatch = line.match(DATE_RANGE_REGEX);
      if (dateMatch) {
        dates = dateMatch[0];
      }
      const gpaMatch = line.match(/GPA[:\s]+([0-4]\.\d{1,2}(?:\s*\/\s*4(?:\.0)?)?)/i);
      if (gpaMatch) {
        gpa = gpaMatch[1];
      }
    }

    const [start, end] = dates.split(/[-–—]/).map((d) => d.trim());
    educationList.push({
      id: 'ed-1',
      institution: institution || 'State University',
      degree: degree || 'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Computer Science',
      location: 'United States',
      startDate: start || '2018',
      endDate: end || '2022',
      gpa: gpa || undefined,
    });
  }

  // 7. Process Projects
  const projectList: Project[] = [];
  if (sectionContent.projects.length > 0) {
    const projLines = sectionContent.projects;
    let currentProj: Project | null = null;

    for (const line of projLines) {
      if (!line.startsWith('•') && !line.startsWith('-') && line.length < 70) {
        if (currentProj && currentProj.bullets.length > 0) {
          projectList.push(currentProj);
        }
        const parts = line.split(/[|–—]/);
        currentProj = {
          id: `proj-${projectList.length + 1}`,
          title: parts[0]?.trim() || 'Technical Project',
          technologies: parts[1]?.trim() || 'React, TypeScript, Cloud Infrastructure',
          bullets: [],
        };
      } else if (currentProj) {
        const cleanBullet = line.replace(/^[•\-\*–>]\s*/, '').trim();
        if (cleanBullet.length > 10) {
          currentProj.bullets.push(cleanBullet);
        }
      }
    }
    if (currentProj && currentProj.bullets.length > 0) {
      projectList.push(currentProj);
    }
  }

  // 8. Process Certifications
  const certList: Certification[] = [];
  if (sectionContent.certifications.length > 0) {
    sectionContent.certifications.forEach((cLine, idx) => {
      const clean = cLine.replace(/^[•\-\*]\s*/, '').trim();
      if (clean.length > 4) {
        certList.push({
          id: `cert-${idx}`,
          name: clean,
          issuer: 'Accredited Authority',
          date: '2023',
        });
      }
    });
  }

  return sanitizeResume({
    contact: {
      fullName: fullName || 'Candidate Name',
      title: title || 'Software Engineer',
      email: email || 'candidate@example.com',
      phone: phone || '+1 (555) 012-3456',
      location: location || 'San Francisco, CA',
      linkedin: linkedin || '',
      github: github || '',
      portfolio: portfolio || '',
    },
    summary: summary || 'Experienced software professional with demonstrated impact building scalable solutions.',
    skills: skillsList,
    experience: experienceList,
    projects: projectList,
    education: educationList,
    certifications: certList,
  });
}
