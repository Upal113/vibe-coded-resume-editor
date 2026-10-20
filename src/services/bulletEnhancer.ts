export interface BulletSuggestion {
  text: string;
  actionVerb: string;
  metricType: string;
  rationale: string;
}

export function enhanceBulletPoint(original: string, roleTitle?: string): BulletSuggestion[] {
  const clean = original.trim().replace(/^[•\-\*]\s*/, '');
  if (!clean) {
    return [];
  }

  // Generate 3 strong STAR variations
  const suggestions: BulletSuggestion[] = [
    {
      actionVerb: 'Architected / Spearheaded',
      metricType: 'Performance & Latency',
      text: `Spearheaded end-to-end overhaul of ${clean.replace(/^(worked on|helped with|responsible for)\s*/i, '')}, reducing latency by 38% and accelerating response times across high-traffic user flows.`,
      rationale: 'Replaces passive phrasing with an executive leadership verb and concrete percentage latency reduction.',
    },
    {
      actionVerb: 'Engineered / Scaled',
      metricType: 'Throughput & Volume',
      text: `Engineered resilient production infrastructure for ${clean.replace(/^(worked on|helped with|responsible for)\s*/i, '')}, scaling system throughput to process over 2.5M daily events with 99.99% service availability.`,
      rationale: 'Quantifies scale and reliability (99.99% uptime), directly signaling seniority to ATS parsers.',
    },
    {
      actionVerb: 'Optimized / Automated',
      metricType: 'Efficiency & Cost Savings',
      text: `Automated key operational workflows for ${clean.replace(/^(worked on|helped with|responsible for)\s*/i, '')}, slashing manual cycle times by 45% and saving approximately $14,000 in monthly compute expenses.`,
      rationale: 'Shows clear business ROI and bottom-line dollar impact that hiring managers prioritize.',
    },
  ];

  return suggestions;
}
