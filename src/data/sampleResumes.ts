import { ResumeData } from '../types/resume';

export const SOFTWARE_ENGINEER_RESUME: ResumeData = {
  contact: {
    fullName: 'Alex Vance',
    title: 'Senior Full Stack Software Engineer',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexvance',
    github: 'github.com/alexvance',
    portfolio: 'alexvance.dev',
  },
  summary:
    'Full Stack Software Engineer with 6+ years of experience designing and scaling distributed systems, cloud microservices, and reactive web applications. Proven track record of reducing latency by 42% and driving revenue growth across high-traffic platforms serving 2M+ monthly active users.',
  skills: [
    {
      id: 's-1',
      category: 'Languages',
      skills: 'TypeScript, Python, Go, Java, SQL (PostgreSQL, MySQL), HTML/CSS',
    },
    {
      id: 's-2',
      category: 'Frameworks & Libraries',
      skills: 'React, Next.js, Node.js, Express, FastAPI, Tailwind CSS, GraphQL, Redux Toolkit',
    },
    {
      id: 's-3',
      category: 'Cloud & Infrastructure',
      skills: 'AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform',
    },
    {
      id: 's-4',
      category: 'Developer Tools & Practices',
      skills: 'Git, Redis, Kafka, Datadog, Jest, Cypress, Microservices, RESTful APIs, Agile/Scrum',
    },
  ],
  experience: [
    {
      id: 'e-1',
      company: 'Starlight Cloud Technologies',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Aug 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected and deployed a multi-tenant event streaming pipeline handling 120M+ daily events using Go and Apache Kafka, decreasing end-to-end data processing latency by 38%.',
        'Spearheaded migration of core monolithic billing service into 4 isolated microservices with Docker and Kubernetes, boosting system uptime from 99.8% to 99.99%.',
        'Implemented Redis distributed caching layer across 18 backend endpoints, cutting average response time from 320ms to 48ms and slashing AWS RDS costs by $18,000 annually.',
        'Mentored 5 junior and mid-level engineers through bi-weekly architectural reviews and instituted strict TypeScript coding standards, reducing production bug reports by 27%.',
      ],
    },
    {
      id: 'e-2',
      company: 'Apex Data Systems',
      role: 'Full Stack Engineer',
      location: 'Austin, TX',
      startDate: 'Jun 2019',
      endDate: 'Jul 2022',
      current: false,
      bullets: [
        'Built interactive real-time telemetry dashboard in React, TypeScript, and WebSockets utilized by 45,000 enterprise administrators, accelerating incident triage speed by 50%.',
        'Designed high-throughput GraphQL APIs and optimized PostgreSQL indexes, accelerating complex relational query speeds by 3.5x under peak load.',
        'Engineered automated CI/CD deployment pipelines using GitHub Actions, reducing release cycle duration from 4 hours to 12 minutes with automated canary rollbacks.',
      ],
    },
    {
      id: 'e-3',
      company: 'Novus Interactive',
      role: 'Associate Software Developer',
      location: 'San Jose, CA',
      startDate: 'May 2018',
      endDate: 'May 2019',
      current: false,
      bullets: [
        'Collaborated with UX and product teams to implement responsive user onboarding flows, boosting new user trial-to-paid conversion rate by 14.5%.',
        'Authored comprehensive unit and integration test suite with Jest and Cypress, elevating test coverage from 52% to 91% across critical payment workflows.',
      ],
    },
  ],
  projects: [
    {
      id: 'p-1',
      title: 'DistriKV — Distributed In-Memory Key-Value Store',
      technologies: 'Go, Raft Consensus, gRPC, Protobuf',
      link: 'github.com/alexvance/distrikv',
      startDate: 'Jan 2023',
      endDate: 'Apr 2023',
      bullets: [
        'Implemented Raft consensus algorithm from scratch to support leader election, log replication, and safe cluster state transitions under network partitions.',
        'Benchmarked throughput using custom load harness, achieving 85,000 writes/sec with sub-5ms write confirmation across 5 distributed nodes.',
      ],
    },
    {
      id: 'p-2',
      title: 'DocuSync — Collaborative Markdown Workspace',
      technologies: 'React, TypeScript, Node.js, WebSockets, CRDTs',
      link: 'docusync.demo.dev',
      startDate: 'Sep 2021',
      endDate: 'Dec 2021',
      bullets: [
        'Engineered conflict-free replicated data type (CRDT) engine powering peer-to-peer real-time collaborative text editing with zero merge collisions.',
        'Integrated client-side markdown compilation and secure end-to-end encryption for 12,000 active open-source contributors.',
      ],
    },
  ],
  education: [
    {
      id: 'ed-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: 'Aug 2014',
      endDate: 'May 2018',
      gpa: '3.85 / 4.0',
      coursework: 'Distributed Systems, Operating Systems, Algorithms & Data Structures, Database Systems',
    },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialId: 'AWS-948194',
    },
  ],
};

export const AI_ML_ENGINEER_RESUME: ResumeData = {
  contact: {
    fullName: 'Elena Rostova',
    title: 'Machine Learning & AI Engineer',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 789-0123',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/elenarostova',
    github: 'github.com/elenarostova',
    portfolio: 'elena-ai.io',
  },
  summary:
    'Machine Learning Engineer with 5+ years of experience specializing in LLM fine-tuning, retrieval-augmented generation (RAG), and production model serving. Reduced model inference latency by 65% while deploying production systems across Fortune 500 enterprises.',
  skills: [
    {
      id: 's-1',
      category: 'AI & Machine Learning',
      skills: 'PyTorch, TensorFlow, Hugging Face Transformers, LangChain, LlamaIndex, vLLM, DeepSpeed',
    },
    {
      id: 's-2',
      category: 'Languages & DBs',
      skills: 'Python, C++, SQL, Vector Databases (Pinecone, Qdrant, Milvus, Chroma), PostgreSQL',
    },
    {
      id: 's-3',
      category: 'MLOps & Cloud',
      skills: 'Kubeflow, MLflow, Triton Inference Server, AWS SageMaker, Docker, Kubernetes, Weights & Biases',
    },
  ],
  experience: [
    {
      id: 'e-1',
      company: 'Cognitive Dynamics AI',
      role: 'Senior Machine Learning Engineer',
      location: 'Seattle, WA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded development of hybrid RAG system processing 4M+ enterprise contracts with Qdrant vector database, boosting semantic retrieval precision by 31%.',
        'Optimized open-weight 70B LLM inference using TensorRT-LLM and speculative decoding, cutting token generation latency from 95ms/token to 32ms/token.',
        'Established continuous model evaluation pipeline with automated hallucination scoring, ensuring 99.2% compliance with client safety standards.',
      ],
    },
  ],
  projects: [
    {
      id: 'p-1',
      title: 'NeuralSearch — Open Source Semantic Search Engine',
      technologies: 'Python, PyTorch, FAISS, FastAPI, ONNX Runtime',
      link: 'github.com/elenarostova/neuralsearch',
      startDate: '2023',
      endDate: '2024',
      bullets: [
        'Built sub-10ms neural search library supporting multilingual embeddings across 10M+ documents with 94.8% Recall@10.',
      ],
    },
  ],
  education: [
    {
      id: 'ed-1',
      institution: 'University of Washington',
      degree: 'Master of Science in Computer Science & Artificial Intelligence',
      fieldOfStudy: 'Artificial Intelligence',
      location: 'Seattle, WA',
      startDate: '2017',
      endDate: '2019',
      gpa: '3.92 / 4.0',
    },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'Google Cloud Professional Machine Learning Engineer',
      issuer: 'Google Cloud',
      date: '2023',
    },
  ],
};
