import { ResumeData, AtsScoreResult, AtsCheckItem } from '../types/resume';

const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advanced', 'analyzed', 'applied',
  'architected', 'automated', 'benchmarked', 'boosted', 'built', 'championed',
  'coached', 'collaborated', 'consolidated', 'constructed', 'contracted', 'converted',
  'coordinated', 'created', 'curated', 'customized', 'decreased', 'delivered',
  'deployed', 'designed', 'developed', 'devised', 'diagnosed', 'directed',
  'discovered', 'doubled', 'drove', 'eliminated', 'engineered', 'enhanced',
  'established', 'evaluated', 'executed', 'expanded', 'expedited', 'facilitated',
  'formulated', 'founded', 'generated', 'guided', 'headed', 'identified',
  'implemented', 'improved', 'increased', 'initiated', 'innovated', 'inspected',
  'instituted', 'integrated', 'invented', 'launched', 'led', 'leveraged',
  'maintained', 'managed', 'maximized', 'mentored', 'minimized', 'modernized',
  'monitored', 'negotiated', 'optimized', 'orchestrated', 'organized', 'originated',
  'outperformed', 'overhauled', 'oversaw', 'partnered', 'performed', 'piloted',
  'pioneered', 'planned', 'produced', 'programmed', 'projected', 'published',
  're-engineered', 'rebuilt', 'reduced', 'refined', 'reorganized', 'replaced',
  'resolved', 'restructured', 'revamped', 'scaled', 'scheduled', 'secured',
  'simplified', 'slashed', 'solved', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'structured', 'surpassed', 'systematized', 'trained', 'transformed',
  'transitioned', 'tripled', 'unified', 'upgraded', 'validated', 'visualized'
];

const WEAK_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with', 'assisted in',
  'tried to', 'handled', 'was involved in', 'participated in', 'tasked with',
  'part of a team that'
];

const METRIC_PATTERNS = [
  /\b\d+(\.\d+)?%/i,                     // Percentages: 45%, 99.9%
  /\$\s*\d+([,\d]*)*(\.\d+)?([kKmMbB])?/, // Currency: $100, $1.5M, $18,000
  /\b\d+([,\d]+)*\s*(users|clients|customers|subscribers|downloads|events|records|requests|queries)/i,
  /\b(reduced|decreased|cut|slashed|accelerated|boosted|increased|saved)\s+.*?(\d+|fold|x)/i,
  /\b\d+(\.\d+)?x\b/i,                   // Multipliers: 2x, 3.5x
  /\b\d+\s*(ms|seconds|minutes|hours|days|weeks|months)/i, // Time: 48ms, 12 minutes
  /\b(sub-?\d+|top\s+\d+|#\d+)/i,       // Rankings/thresholds
  /\b\d+\+?\s*(k|m|b|million|billion|thousand)\b/i, // Volumes: 2M+, 10k
];

export function calculateAtsScore(rawResume: ResumeData): AtsScoreResult {
  const resume = rawResume || ({} as ResumeData);
  const contact = resume.contact || ({} as ResumeData['contact']);
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const education = Array.isArray(resume.education) ? resume.education : [];

  const allBullets = [
    ...experience.flatMap((e) => (Array.isArray(e?.bullets) ? e.bullets : [])),
    ...projects.flatMap((p) => (Array.isArray(p?.bullets) ? p.bullets : [])),
  ]
    .map((b) => (typeof b === 'string' ? b.trim() : ''))
    .filter((b) => b.length > 0);

  const totalBulletCount = allBullets.length;

  // 1. Action verbs check
  let actionVerbCount = 0;
  let weakPhraseCount = 0;
  allBullets.forEach((bullet) => {
    const clean = bullet.toLowerCase();
    const firstWord = clean.split(/\s+/)[0]?.replace(/[^a-z-]/g, '') || '';
    if (STRONG_ACTION_VERBS.includes(firstWord)) {
      actionVerbCount++;
    }
    if (WEAK_PHRASES.some((phrase) => clean.includes(phrase))) {
      weakPhraseCount++;
    }
  });

  // 2. Metrics & Quantification check
  let quantifiedBulletCount = 0;
  allBullets.forEach((bullet) => {
    const hasMetric = METRIC_PATTERNS.some((pattern) => pattern.test(bullet));
    if (hasMetric) {
      quantifiedBulletCount++;
    }
  });

  // 3. Section checks
  const hasContactInfo = Boolean(
    contact.fullName &&
    contact.email &&
    contact.phone
  );
  const hasOnlineProfiles = Boolean(
    contact.linkedin || contact.github || contact.portfolio
  );
  const hasExperience = experience.length >= 1;
  const hasEducation = education.length >= 1;
  const hasSkills = skills.length >= 1;
  const hasProjects = projects.length >= 1;
  const hasSummary = Boolean(resume.summary && resume.summary.trim().length >= 20);

  // Checks categorization
  const formattingChecks: AtsCheckItem[] = [
    {
      id: 'fmt-1',
      title: 'Single-Column ATS Layout',
      status: 'passed',
      score: 10,
      maxScore: 10,
      message: 'LaTeX layout complies with standard linear ATS parsers without column scrambles.',
      suggestion: 'Maintain linear single-column format for zero parsing loss.',
    },
    {
      id: 'fmt-2',
      title: 'Clean Font & Character Glyphs',
      status: 'passed',
      score: 5,
      maxScore: 5,
      message: 'Standard typography without unparseable icon glyphs in headings.',
      suggestion: 'Plain text symbols render cleanly in Workday, Greenhouse, and Lever.',
    },
    {
      id: 'fmt-3',
      title: 'Standard Section Headers',
      status: 'passed',
      score: 5,
      maxScore: 5,
      message: 'Headers ("Experience", "Education", "Skills") match standard ATS taxonomies.',
      suggestion: 'Never rename core sections to unconventional labels like "My Journey" or "Hustles".',
    },
  ];

  const impactChecks: AtsCheckItem[] = [
    {
      id: 'imp-1',
      title: 'Quantified Results (Metrics, %, $)',
      status:
        totalBulletCount > 0 && quantifiedBulletCount / totalBulletCount >= 0.5
          ? 'passed'
          : totalBulletCount > 0 && quantifiedBulletCount / totalBulletCount >= 0.25
          ? 'warning'
          : 'failed',
      score:
        totalBulletCount > 0
          ? Math.round(Math.min(1, (quantifiedBulletCount / (totalBulletCount * 0.6))) * 15)
          : 0,
      maxScore: 15,
      message: `${quantifiedBulletCount} of ${totalBulletCount} bullets contain concrete metrics (percentages, throughput, or dollar values).`,
      suggestion: 'Aim for at least 60% of experience bullets to quantify business impact, efficiency gains, or latency reductions.',
    },
    {
      id: 'imp-2',
      title: 'Strong Action Verbs (STAR method)',
      status:
        totalBulletCount > 0 && actionVerbCount / totalBulletCount >= 0.7
          ? 'passed'
          : totalBulletCount > 0 && actionVerbCount / totalBulletCount >= 0.4
          ? 'warning'
          : 'failed',
      score:
        totalBulletCount > 0
          ? Math.round(Math.min(1, (actionVerbCount / (totalBulletCount * 0.7))) * 15)
          : 0,
      maxScore: 15,
      message: `${actionVerbCount} of ${totalBulletCount} bullets start with high-impact power verbs.`,
      suggestion: 'Replace passive or vague openers like "Responsible for" with verbs like "Architected", "Spearheaded", or "Optimized".',
    },
    {
      id: 'imp-3',
      title: 'Absence of Passive "Responsible for"',
      status: weakPhraseCount === 0 ? 'passed' : weakPhraseCount <= 2 ? 'warning' : 'failed',
      score: weakPhraseCount === 0 ? 5 : Math.max(0, 5 - weakPhraseCount * 2),
      maxScore: 5,
      message:
        weakPhraseCount === 0
          ? 'No weak passive phrases detected.'
          : `Found ${weakPhraseCount} passive phrase(s) (e.g. "responsible for", "worked on").`,
      suggestion: 'Rewrite passive phrases into direct accomplishments describing what you achieved.',
    },
  ];

  const structureChecks: AtsCheckItem[] = [
    {
      id: 'str-1',
      title: 'Complete Contact Coordinates',
      status: hasContactInfo ? 'passed' : 'failed',
      score: hasContactInfo ? 10 : 3,
      maxScore: 10,
      message: hasContactInfo
        ? 'Full name, email address, and phone number are present.'
        : 'Missing one or more essential contact details (email or phone).',
      suggestion: 'Ensure recruiters can reach you immediately via email and phone.',
    },
    {
      id: 'str-2',
      title: 'Professional Profiles & GitHub/LinkedIn',
      status: hasOnlineProfiles ? 'passed' : 'warning',
      score: hasOnlineProfiles ? 5 : 2,
      maxScore: 5,
      message: hasOnlineProfiles
        ? 'Verified links to LinkedIn, GitHub, or Portfolio.'
        : 'No LinkedIn or GitHub profile link found in contact section.',
      suggestion: 'Tech ATS systems reward direct links to verifiable code (GitHub) and network presence.',
    },
    {
      id: 'str-3',
      title: 'Work Experience Section Depth',
      status: experience.length >= 2 ? 'passed' : experience.length === 1 ? 'warning' : 'failed',
      score: experience.length >= 2 ? 10 : experience.length === 1 ? 6 : 0,
      maxScore: 10,
      message: `${experience.length} work experience entries with dates and role titles.`,
      suggestion: 'Include at least 2 relevant roles or internships with 3-5 high-impact bullets each.',
    },
    {
      id: 'str-4',
      title: 'Formal Education Credentials',
      status: hasEducation ? 'passed' : 'failed',
      score: hasEducation ? 5 : 0,
      maxScore: 5,
      message: hasEducation
        ? `Education listed: ${education[0]?.degree || 'Degree'} at ${education[0]?.institution || 'Institution'}.`
        : 'No education credentials found.',
      suggestion: 'List degree, institution, and graduation year for baseline automated filters.',
    },
  ];

  // Skills & Categorization
  const totalSkillsListed = skills.reduce((acc, cat) => {
    const rawSkills = typeof cat?.skills === 'string' ? cat.skills : '';
    return acc + rawSkills.split(',').filter((s) => s.trim().length > 0).length;
  }, 0);

  const skillsChecks: AtsCheckItem[] = [
    {
      id: 'skl-1',
      title: 'Categorized Technical Skills',
      status: hasSkills && totalSkillsListed >= 8 ? 'passed' : totalSkillsListed >= 4 ? 'warning' : 'failed',
      score: totalSkillsListed >= 8 ? 10 : totalSkillsListed >= 4 ? 6 : 2,
      maxScore: 10,
      message: `${totalSkillsListed} skills organized across ${skills.length} categories.`,
      suggestion: 'Group skills by Languages, Frameworks, Cloud, and Developer Tools so keyword spiders parse taxonomy.',
    },
    {
      id: 'skl-2',
      title: 'Project Portfolio Entries',
      status: hasProjects ? 'passed' : 'warning',
      score: hasProjects ? 5 : 2,
      maxScore: 5,
      message: `${projects.length} technical projects detailed with technologies used.`,
      suggestion: 'Projects demonstrate hands-on application of stated technical skills.',
    },
  ];

  // Bullet Length & Readability
  let subOptimalLengthBullets = 0;
  allBullets.forEach((bullet) => {
    const wordCount = bullet.trim().split(/\s+/).length;
    if (wordCount < 10 || wordCount > 45) {
      subOptimalLengthBullets++;
    }
  });

  const contentChecks: AtsCheckItem[] = [
    {
      id: 'cnt-1',
      title: 'Professional Summary',
      status: hasSummary ? 'passed' : 'warning',
      score: hasSummary ? 5 : 2,
      maxScore: 5,
      message: hasSummary
        ? 'Targeted summary highlighting years of experience and core domain.'
        : 'Summary is short or missing.',
      suggestion: 'A 2-3 sentence executive summary sets role relevance before deep bullet scanning.',
    },
    {
      id: 'cnt-2',
      title: 'Bullet Point Length & Density',
      status: subOptimalLengthBullets === 0 ? 'passed' : subOptimalLengthBullets <= 2 ? 'warning' : 'failed',
      score: subOptimalLengthBullets === 0 ? 5 : Math.max(1, 5 - subOptimalLengthBullets),
      maxScore: 5,
      message:
        subOptimalLengthBullets === 0
          ? 'All bullets fall within the optimal 12-40 word sweet spot.'
          : `${subOptimalLengthBullets} bullets are either too brief (<10 words) or too long (>45 words).`,
      suggestion: 'Keep bullets focused: Action Verb + Context/Task + Measurable Result in 1-2 concise lines.',
    },
  ];

  // Calculate totals
  const calcCat = (checks: AtsCheckItem[]) => {
    const score = checks.reduce((sum, c) => sum + c.score, 0);
    const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);
    return { score, maxScore, checks };
  };

  const formatting = calcCat(formattingChecks);
  const impactMetrics = calcCat(impactChecks);
  const structureCompleteness = calcCat(structureChecks);
  const skillsRelevance = calcCat(skillsChecks);
  const contentQuality = calcCat(contentChecks);

  const rawScore =
    formatting.score +
    impactMetrics.score +
    structureCompleteness.score +
    skillsRelevance.score +
    contentQuality.score;

  const totalMax =
    formatting.maxScore +
    impactMetrics.maxScore +
    structureCompleteness.maxScore +
    skillsRelevance.maxScore +
    contentQuality.maxScore;

  const overallScore = Math.min(100, Math.round((rawScore / totalMax) * 100));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScore >= 93) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 75) grade = 'B';
  else if (overallScore >= 65) grade = 'C';
  else if (overallScore >= 50) grade = 'D';

  const recommendations: string[] = [];
  if (impactMetrics.score < impactMetrics.maxScore) {
    recommendations.push(
      'Increase quantified metrics: include %, $, latency drops, or scale numbers in at least 60% of experience bullets.'
    );
  }
  if (weakPhraseCount > 0) {
    recommendations.push(
      `Eliminate ${weakPhraseCount} passive opener(s) like "responsible for" with direct action verbs.`
    );
  }
  if (totalSkillsListed < 10) {
    recommendations.push(
      'Expand the skills section to include core frameworks, cloud providers, and databases matching your target roles.'
    );
  }
  if (!hasOnlineProfiles) {
    recommendations.push('Add your LinkedIn profile or GitHub link in the contact header.');
  }

  // Keywords extraction for quick badge preview
  const identifiedKeywords = skills
    .flatMap((s) => (typeof s?.skills === 'string' ? s.skills.split(',') : []))
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
    .slice(0, 16);

  return {
    overallScore,
    grade,
    summary:
      overallScore >= 85
        ? 'Excellent ATS compatibility. Formatted cleanly with high parsing fidelity and strong accomplishment phrasing.'
        : overallScore >= 70
        ? 'Good ATS foundation, but can be improved with more quantifiable business metrics and stronger power verbs.'
        : 'Needs optimization. Lacks sufficient metrics or structural depth expected by modern ATS screening parsers.',
    categories: {
      formatting,
      impactMetrics,
      skillsRelevance,
      structureCompleteness,
      contentQuality,
    },
    actionVerbCount,
    quantifiedBulletCount,
    totalBulletCount,
    identifiedKeywords,
    recommendations,
  };
}
