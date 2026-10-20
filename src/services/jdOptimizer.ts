import { ResumeData, JdMatchResult } from '../types/resume';

const TECH_KEYWORDS_DICTIONARY = [
  // Languages
  'python', 'javascript', 'typescript', 'go', 'golang', 'java', 'c++', 'c#', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'scala', 'sql', 'r', 'bash', 'shell', 'html', 'css',
  // Frontend
  'react', 'next.js', 'vue', 'angular', 'svelte', 'tailwind', 'redux', 'graphql',
  'webpack', 'vite', 'responsive design', 'web performance', 'accessibility', 'wcag',
  // Backend & Cloud
  'node.js', 'express', 'fastapi', 'django', 'spring boot', 'gin', 'flask',
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ci/cd',
  'github actions', 'helm', 'ansible', 'serverless', 'lambda', 'microservices',
  // Data & AI
  'postgresql', 'mysql', 'mongodb', 'redis', 'kafka', 'elasticsearch', 'rabbitmq',
  'snowflake', 'spark', 'pytorch', 'tensorflow', 'llm', 'rag', 'genai', 'machine learning',
  'deep learning', 'hugging face', 'langchain', 'vector database', 'pandas', 'numpy',
  // Practices & Systems
  'distributed systems', 'restful api', 'grpc', 'system architecture', 'unit testing',
  'jest', 'cypress', 'datadog', 'prometheus', 'grafana', 'agile', 'scrum', 'ci/cd'
];

export function analyzeJobDescription(jdText: string, resume: ResumeData): JdMatchResult {
  if (!jdText || jdText.trim().length === 0) {
    return {
      matchScore: 0,
      totalJdKeywords: 0,
      matchedCount: 0,
      missingCount: 0,
      matchedKeywords: [],
      missingKeywords: [],
      criticalKeywords: [],
      recommendations: ['Paste a job description to trigger automated keyword and skill extraction.'],
    };
  }

  const jdLower = jdText.toLowerCase();

  const safeResume = resume || ({} as ResumeData);
  const contact = safeResume.contact || ({} as ResumeData['contact']);
  const skills = Array.isArray(safeResume.skills) ? safeResume.skills : [];
  const experience = Array.isArray(safeResume.experience) ? safeResume.experience : [];
  const projects = Array.isArray(safeResume.projects) ? safeResume.projects : [];
  const education = Array.isArray(safeResume.education) ? safeResume.education : [];
  const certs = Array.isArray(safeResume.certifications) ? safeResume.certifications : [];

  // Extract all resume text into unified lowercase blob safely
  const resumeTokens = [
    contact.title || '',
    safeResume.summary || '',
    ...skills.flatMap((s) => [s?.category || '', s?.skills || '']),
    ...experience.flatMap((e) => [
      e?.company || '',
      e?.role || '',
      ...(Array.isArray(e?.bullets) ? e.bullets : []),
    ]),
    ...projects.flatMap((p) => [
      p?.title || '',
      p?.technologies || '',
      ...(Array.isArray(p?.bullets) ? p.bullets : []),
    ]),
    ...education.flatMap((ed) => [
      ed?.degree || '',
      ed?.fieldOfStudy || '',
      ed?.institution || '',
      ed?.coursework || '',
    ]),
    ...certs.flatMap((c) => [c?.name || '', c?.issuer || '']),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Find occurrences of known keywords in the JD
  const foundInJd = new Set<string>();
  TECH_KEYWORDS_DICTIONARY.forEach((keyword) => {
    // Word boundary check
    const regex = new RegExp(`\\b${keyword.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    if (regex.test(jdLower)) {
      foundInJd.add(keyword);
    }
  });

  // Also extract frequent tech/domain capitalised phrases or words
  const customTechMatches = jdText.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
  customTechMatches.forEach((token) => {
    const t = token.toLowerCase();
    if (
      !['The', 'You', 'Our', 'We', 'This', 'And', 'For', 'With', 'Have', 'Must', 'Will', 'Are', 'Role', 'Team', 'Company', 'Work', 'Job'].includes(token) &&
      t.length > 3
    ) {
      if (TECH_KEYWORDS_DICTIONARY.includes(t)) {
        foundInJd.add(t);
      }
    }
  });

  const jdKeywordsList = Array.from(foundInJd);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywordsList.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    if (regex.test(resumeTokens)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const totalJdKeywords = jdKeywordsList.length;
  const matchedCount = matchedKeywords.length;
  const missingCount = missingKeywords.length;

  const matchScore = totalJdKeywords > 0 ? Math.round((matchedCount / totalJdKeywords) * 100) : 100;

  // Critical keywords: those repeated multiple times in the JD
  const criticalKeywords = missingKeywords.filter((keyword) => {
    const count = (jdLower.match(new RegExp(keyword, 'g')) || []).length;
    return count >= 2;
  });

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Add high-value missing keywords to your skills or project bullets: ${missingKeywords.slice(0, 5).join(', ')}.`
    );
  }
  if (criticalKeywords.length > 0) {
    recommendations.push(
      `Crucial requirements emphasized in JD but absent in resume: ${criticalKeywords.join(', ')}.`
    );
  }
  if (matchScore >= 80) {
    recommendations.push('Strong keyword alignment! Your resume satisfies over 80% of identified technical criteria.');
  } else if (matchScore >= 60) {
    recommendations.push('Moderate match. Integrating 3-4 missing keywords will push your resume past initial ATS candidate thresholds.');
  } else {
    recommendations.push('Low match. Consider tailoring your experience descriptions and skills list to directly reflect this job description.');
  }

  return {
    matchScore,
    totalJdKeywords,
    matchedCount,
    missingCount,
    matchedKeywords,
    missingKeywords,
    criticalKeywords,
    recommendations,
  };
}
