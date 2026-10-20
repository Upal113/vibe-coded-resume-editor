import { ResumeData } from '../types/resume';

function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function generateLatexCode(rawResume: ResumeData): string {
  const resume = rawResume || ({} as ResumeData);
  const contact = resume.contact || ({} as ResumeData['contact']);
  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const education = Array.isArray(resume.education) ? resume.education : [];
  const certs = Array.isArray(resume.certifications) ? resume.certifications : [];

  const contactParts: string[] = [];

  if (contact.phone) {
    contactParts.push(escapeLatex(contact.phone));
  }
  if (contact.email) {
    contactParts.push(`\\href{mailto:${escapeLatex(contact.email)}}{${escapeLatex(contact.email)}}`);
  }
  if (contact.linkedin) {
    contactParts.push(`\\href{https://${contact.linkedin.replace(/^https?:\/\//, '')}}{\\underline{${escapeLatex(contact.linkedin)}}}`);
  }
  if (contact.github) {
    contactParts.push(`\\href{https://${contact.github.replace(/^https?:\/\//, '')}}{\\underline{${escapeLatex(contact.github)}}}`);
  }
  if (contact.portfolio) {
    contactParts.push(`\\href{https://${contact.portfolio.replace(/^https?:\/\//, '')}}{\\underline{${escapeLatex(contact.portfolio)}}}`);
  }

  const contactHeaderLine = contactParts.join(' $|$ ');

  // Skills
  const skillsLatex = skills
    .map(
      (s) =>
        `    \\textbf{${escapeLatex(s?.category || 'Skills')}}: {${escapeLatex(s?.skills || '')}} \\\\`
    )
    .join('\n');

  // Experience
  const experienceLatex = experience
    .map((exp) => {
      const dates = `${escapeLatex(exp?.startDate || '')} -- ${exp?.current ? 'Present' : escapeLatex(exp?.endDate || '')}`;
      const bullets = (Array.isArray(exp?.bullets) ? exp.bullets : [])
        .map((b) => (typeof b === 'string' ? b.trim() : ''))
        .filter((b) => b.length > 0)
        .map((b) => `        \\resumeItem{${escapeLatex(b)}}`)
        .join('\n');

      return `    \\resumeSubheading
      {${escapeLatex(exp?.role || '')}}{${dates}}
      {${escapeLatex(exp?.company || '')}}{${escapeLatex(exp?.location || '')}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
    })
    .join('\n\n');

  // Projects
  const projectsLatex = projects
    .map((p) => {
      const dates = p?.startDate && p?.endDate ? `${escapeLatex(p.startDate)} -- ${escapeLatex(p.endDate)}` : '';
      const link = p?.link ? `$|$ \\emph{\\href{https://${p.link.replace(/^https?:\/\//, '')}}{${escapeLatex(p.link)}}}` : '';
      const bullets = (Array.isArray(p?.bullets) ? p.bullets : [])
        .map((b) => (typeof b === 'string' ? b.trim() : ''))
        .filter((b) => b.length > 0)
        .map((b) => `        \\resumeItem{${escapeLatex(b)}}`)
        .join('\n');

      return `    \\resumeProjectHeading
      {\\textbf{${escapeLatex(p?.title || '')}} $|$ \\emph{${escapeLatex(p?.technologies || '')}} ${link}}{${dates}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
    })
    .join('\n\n');

  // Education
  const educationLatex = education
    .map((ed) => {
      const dates = `${escapeLatex(ed?.startDate || '')} -- ${escapeLatex(ed?.endDate || '')}`;
      const extraGpa = ed?.gpa ? ` $|$ \\textit{GPA: ${escapeLatex(ed.gpa)}}` : '';
      const extraCourse = ed?.coursework
        ? `\n      \\resumeItemListStart\n        \\resumeItem{Relevant Coursework: ${escapeLatex(ed.coursework)}}\n      \\resumeItemListEnd`
        : '';

      return `    \\resumeSubheading
      {${escapeLatex(ed?.institution || '')}}{${escapeLatex(ed?.location || '')}}
      {${escapeLatex(ed?.degree || '')}${extraGpa}}{${dates}}${extraCourse}`;
    })
    .join('\n\n');

  // Certifications
  const certsLatex = certs.length > 0
    ? `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
  \\resumeItemListStart
${certs
  .map((c) => `    \\resumeItem{\\textbf{${escapeLatex(c?.name || '')}} -- ${escapeLatex(c?.issuer || '')} (${escapeLatex(c?.date || '')})}`)
  .join('\n')}
  \\resumeItemListEnd
`
    : '';

  return `%-------------------------
% PushResume LaTeX Template (ATS-Optimized)
% Based on standard Jake's Resume Overleaf format
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(resume.contact.fullName)}} \\\\ \\vspace{1pt}
    \\small ${contactHeaderLine}
\\end{center}

${
  resume.summary
    ? `%-----------SUMMARY-----------
\\section{Professional Summary}
\\small{${escapeLatex(resume.summary)}}
\\vspace{-4pt}
`
    : ''
}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${educationLatex}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experienceLatex}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
${projectsLatex}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillsLatex}
    }}
 \\end{itemize}
${certsLatex}
%-------------------------------------------
\\end{document}
`;
}
