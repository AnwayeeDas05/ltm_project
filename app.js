/* ===================================
   CAMPUS COMPASS — Intelligent Conversational Engine
   =================================== */

// Global User State Memory across the conversation session
const userProfile = {
  targetRole: null,
  branch: null,
  year: null,
  currentSkills: [],
  interests: [],
  targetCompany: null,
  lastIntent: null,
  interactionCount: 0
};

// ---- Module Data ---- //
const modules = {
  career: {
    name: 'Career Navigator',
    icon: '🧭',
    statusLabel: '● Active — Career Navigator Mode',
    quickPrompts: [
      'I want to become a Data Engineer',
      'What careers suit a CSE student?',
      'Compare Software Engineer vs Product Manager',
      'Roadmap for AI/ML in India',
    ],
    greeting: `👋 Hi! I'm **Campus Compass AI**, your personal career navigator.\n\nI can help you:\n- 🗺️ **Map career pathways** (Data Engineering, AI/ML, Cloud, SDE, Product)\n- 📊 **Analyze market demand & salary trends** across top tech companies\n- 🎯 **Create progressive, phase-wise roadmaps** with skill milestones\n\nTell me what role you're aiming for, your branch, or ask any placement question!`
  },
  resume: {
    name: 'Resume Analyzer',
    icon: '📝',
    statusLabel: '● Active — Resume Analyzer Mode',
    quickPrompts: [
      'How do I improve my ATS score?',
      'What skills to add for a Data Engineer?',
      'Help me write a strong summary',
      'How to quantify project bullet points?',
    ],
    greeting: `📝 Welcome to the **Resume Intelligence Engine**!\n\nI can help you:\n- 🎯 **Score your resume** against modern ATS parsers\n- 🔍 **Identify keyword gaps** for specific technical roles\n- ✍️ **Rewrite weak bullet points** into high-impact metrics (Google XYZ formula)\n- 📊 **Target role alignment** to increase shortlist odds\n\nPaste your current resume summary, bullet points, or target job role to get started!`
  },
  interview: {
    name: 'Mock Interview',
    icon: '🎙️',
    statusLabel: '● Active — Mock Interview Mode',
    quickPrompts: [
      'Interview questions for Data Engineer',
      'Start an Amazon SDE simulation',
      'Practice HR behavioral questions',
      'STAR method framework with examples',
    ],
    greeting: `🎙️ **Mock Interview Coach is Ready!**\n\nI simulate real-world campus & lateral technical rounds:\n- 🏢 **Company-specific technical interviews** (Amazon, Google, TCS, Infosys, Startups)\n- 🤝 **Behavioral & HR rounds** evaluated with the STAR method\n- 🧠 **System Design & SQL/Coding problem walkthroughs**\n\nTell me which company or role you're interviewing for to begin a mock session!`
  },
  skill: {
    name: 'Skill Gap Detector',
    icon: '⚡',
    statusLabel: '● Active — Skill Gap Detector Mode',
    quickPrompts: [
      'Skill gap for Data Engineer role',
      'Skills for Google SWE intern',
      'I want to become a Full-Stack Dev',
      'Is my profile ready for placements?',
    ],
    greeting: `⚡ **Skill Gap Detector — Online!**\n\nI analyze your profile against 1,000+ real job descriptions and identify:\n1. 🔴 **Critical gaps** (deal-breakers for initial screening)\n2. 🟡 **Important skills** (frequently tested in technical rounds)\n3. 🟢 **Bonus differentiators** (portfolio projects, certifications)\n\nShare your target role and your current tech stack to generate your report!`
  },
  placement: {
    name: 'Placement Tracker',
    icon: '🏢',
    statusLabel: '● Active — Placement Tracker Mode',
    quickPrompts: [
      'Show upcoming placement drives',
      'What is the cutoff CGPA for TCS?',
      'Top hiring companies for Data Engineers',
      'How to prepare for campus recruitment?',
    ],
    greeting: `🏢 **Placement Drive Intelligence — Activated!**\n\nI track campus recruitment drives, company hiring patterns, and eligibility criteria:\n- 📅 **Recruitment schedules & cutoff criteria** (CGPA, backlogs, rounds)\n- 📋 **Company-specific prep roadmaps**\n- 🎯 **Target company matching** based on your branch and skills\n\nWhat placement information or company prep guide do you need?`
  }
};

// ---- Deep Domain Knowledge Database ---- //
const careerRoleKnowledge = {
  'data engineer': {
    title: 'Data Engineer',
    emoji: '🏗️',
    category: 'Data & Cloud Infrastructure',
    demand: 'Extremely High (35% YoY growth in India)',
    avgSalary: '₹8.5–22 LPA (Campus/Early Career), ₹28+ LPA (Senior)',
    summary: 'Data Engineers design, construct, test, and maintain scalable data pipelines and architectures that convert raw transactional data into clean, actionable formats for Data Scientists and business analytics.',
    roadmap: [
      {
        phase: 'Phase 1: Foundations & Core Data Systems (Month 1–2)',
        items: [
          'Advanced Python (OOP, generators, decorators, testing)',
          'Advanced SQL Mastery (Window functions, CTEs, indexing, query optimization, EXPLAIN plans)',
          'Linux & Shell Scripting (Bash automation, cron jobs, environment management)',
          'Git & Collaboration workflows'
        ]
      },
      {
        phase: 'Phase 2: Distributed Computing & Data Warehousing (Month 3–4)',
        items: [
          'Apache Spark (PySpark) — DataFrame API, memory management, partitioning & shuffling',
          'Data Warehousing concepts: Star/Snowflake schemas, SCD Type 1 & 2',
          'Modern Cloud Data Warehouses: Snowflake or Google BigQuery or AWS Redshift',
          'Data Modeling & ETL/ELT pipeline design'
        ]
      },
      {
        phase: 'Phase 3: Orchestration, Streaming & Lakehouse (Month 5–6)',
        items: [
          'Workflow Orchestration: Apache Airflow (DAGs, operators, sensor patterns)',
          'Real-time streaming: Apache Kafka fundamentals (Producers, Consumers, Topics, Partitioning)',
          'Lakehouse Architecture: Delta Lake / Apache Iceberg',
          'Cloud infrastructure basics: AWS (S3, EMR, Glue) or GCP (Cloud Storage, Dataproc)'
        ]
      }
    ],
    skills: [
      { name: 'SQL & Query Optimization', score: 95, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'Python / PySpark', score: 90, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'Data Warehousing (Snowflake/BigQuery)', score: 80, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'Orchestration (Airflow)', score: 75, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'Kafka / Streaming Basics', score: 65, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' }
    ],
    projects: [
      '**End-to-End Batch Lakehouse:** Ingest NYC Taxi or COVID-19 dataset into AWS S3/GCS, transform using PySpark on Databricks, store in Delta Lake/Snowflake, schedule via Airflow.',
      '**Real-Time Streaming Pipeline:** Stream live Twitter/Reddit or cryptocurrency trades via Kafka into Spark Streaming, write aggregated metrics to PostgreSQL with Grafana dashboard.'
    ],
    interviewRounds: [
      '**Round 1:** Complex SQL (LeetCode SQL Hard, window functions, cumulative metrics) + DSA (HashMaps, Trees)',
      '**Round 2:** Data System Design (Designing a high-throughput clickstream data ingestion pipeline)',
      '**Round 3:** Pipeline debugging, PySpark optimization, Data Modeling scenario & Behavioral'
    ],
    topCompanies: ['Amazon', 'Walmart Global Tech', 'Tiger Analytics', 'Fractal', 'PhonePe', 'Flipkart', 'Uber', 'TCS Digital']
  },

  'data scientist': {
    title: 'Data Scientist',
    emoji: '📊',
    category: 'Artificial Intelligence & Analytics',
    demand: 'Very High across product & analytics firms',
    avgSalary: '₹8–20 LPA (Fresher/Entry Level)',
    summary: 'Data Scientists leverage statistics, machine learning, and predictive modeling to extract actionable insights and deploy intelligent models from complex structured and unstructured data.',
    roadmap: [
      {
        phase: 'Phase 1: Mathematics & Programming (Month 1–2)',
        items: ['Python (NumPy, Pandas, Matplotlib, Seaborn)', 'Linear Algebra, Calculus, Probability distributions', 'Hypothesis testing, A/B Testing fundamentals', 'SQL querying']
      },
      {
        phase: 'Phase 2: Classical Machine Learning (Month 3–4)',
        items: ['Supervised Learning (Regression, Random Forests, XGBoost, LightGBM)', 'Unsupervised Learning (K-Means, PCA, Hierarchical clustering)', 'Feature Engineering & Cross-validation', 'Scikit-Learn pipeline creation']
      },
      {
        phase: 'Phase 3: Deep Learning, NLP & Deployment (Month 5–6)',
        items: ['PyTorch or TensorFlow fundamentals', 'Transformers & HuggingFace basics', 'Model deployment via FastAPI & Docker', 'MLflow for experiment tracking']
      }
    ],
    skills: [
      { name: 'Python & Data Wrangling', score: 95, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'Applied Statistics & ML', score: 85, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'SQL & Feature Stores', score: 80, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'Deep Learning / NLP', score: 70, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'Model Deployment (API/Docker)', score: 60, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' }
    ],
    projects: [
      '**Customer Churn & LTV Predictor:** End-to-end pipeline with XGBoost, explainability via SHAP values, deployed with Streamlit UI.',
      '**Multimodal Semantic Search:** Vector embeddings using Sentence-Transformers with FAISS/Pinecone vector database.'
    ],
    interviewRounds: [
      '**Round 1:** Probability, Statistics, SQL & Python data manipulation',
      '**Round 2:** Machine Learning theory (bias-variance, loss functions, metrics: AUC-ROC, F1)',
      '**Round 3:** Business Case Study / ML System Design + Past Project Deep-Dive'
    ],
    topCompanies: ['Google', 'Microsoft', 'Flipkart', 'Fractal Analytics', 'Mu Sigma', 'Swiggy', 'Zomato']
  },

  'software engineer': {
    title: 'Software Development Engineer (SDE)',
    emoji: '💻',
    category: 'Core Software Engineering',
    demand: 'Consistently Highest volume across campus placements',
    avgSalary: '₹7–26 LPA (Tier 1/Tier 2 campus range)',
    summary: 'SDEs architect, implement, test, and maintain robust production software systems, backend services, and scalable web applications.',
    roadmap: [
      {
        phase: 'Phase 1: DSA Mastery & Language Depth (Month 1–3)',
        items: ['Master 1 language thoroughly (Java, C++, or Python)', 'Solve 150+ LeetCode problems (Arrays, Two Pointers, Trees, Graphs, DP)', 'Complexity analysis (Time & Space Big-O)']
      },
      {
        phase: 'Phase 2: Core CS Subjects & Web Backend (Month 3–4)',
        items: ['DBMS: Normalization, ACID properties, Indexing, Transactions', 'OS: Process vs Thread, Concurrency, Virtual Memory, Deadlocks', 'Computer Networks: TCP/IP, HTTP/HTTPS, DNS, WebSockets', 'Build REST APIs with Node.js/Spring Boot/Go']
      },
      {
        phase: 'Phase 3: System Design & Production Projects (Month 5–6)',
        items: ['Low-Level Design (SOLID principles, OOP design patterns)', 'High-Level Design basics (Load balancers, Caching with Redis, Database sharding)', '2 Full-stack production-grade projects with authentication, CI/CD, and unit tests']
      }
    ],
    skills: [
      { name: 'Data Structures & Algorithms', score: 95, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'Backend Language (Java/C++/Go)', score: 85, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'Core CS (OS, DBMS, Networks)', score: 85, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'System Design (LLD/HLD)', score: 70, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'Cloud & DevOps (Docker/AWS)', score: 60, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' }
    ],
    projects: [
      '**Distributed URL Shortener / Rate Limiter:** Redis token bucket rate limiter with sliding window log & PostgreSQL backend.',
      '**Real-time Collaborative Whiteboard / Chat:** WebSocket architecture with room state sync, Redis Pub/Sub, and Dockerized deployment.'
    ],
    interviewRounds: [
      '**Online Assessment:** 2–3 algorithmic coding problems (70–90 min)',
      '**Technical Round 1 & 2:** Live coding (DSA), CS fundamentals, deep dive into past projects',
      '**Technical Round 3:** Low-Level System Design & Code quality',
      '**Bar Raiser / HR:** Behavioral STAR questions & leadership qualities'
    ],
    topCompanies: ['Amazon', 'Microsoft', 'Google', 'Cisco', 'Adobe', 'Oracle', 'JPMorgan Chase', 'Intuit']
  },

  'full stack': {
    title: 'Full-Stack Developer',
    emoji: '⚡',
    category: 'Web & Application Development',
    demand: 'High across startups and tech firms',
    avgSalary: '₹6–20 LPA',
    summary: 'Full-Stack Developers design intuitive client-side user interfaces and engineer resilient, high-throughput backend APIs and database schemas.',
    roadmap: [
      {
        phase: 'Phase 1: Modern Frontend (Month 1–2)',
        items: ['Semantic HTML5, CSS3, Flexbox/Grid, Responsive Design', 'Modern JavaScript (ES6+, Async/Await, Closures, DOM)', 'React 18 / Next.js (Hooks, Context, SSR, State Management with Zustand/Redux)']
      },
      {
        phase: 'Phase 2: Scalable Backend & Databases (Month 3–4)',
        items: ['Node.js & Express or FastAPI', 'RESTful API architecture & GraphQL', 'SQL (PostgreSQL) + NoSQL (MongoDB)', 'Authentication: JWT, OAuth2, Session management']
      },
      {
        phase: 'Phase 3: DevOps & Production Deployment (Month 5–6)',
        items: ['Docker containerization', 'CI/CD pipelines with GitHub Actions', 'Cloud deployment: Vercel, Render, AWS ECS/S3', 'Monitoring, logging & unit testing (Jest, PyTest)']
      }
    ],
    skills: [
      { name: 'HTML/CSS & Responsive Design', score: 90, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'JavaScript & React / Next.js', score: 85, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'Node.js / Python Backend', score: 75, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'PostgreSQL / MongoDB', score: 70, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'Docker & CI/CD', score: 55, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' }
    ],
    projects: [
      '**SaaS Project Management Tool:** Next.js, Tailwind, Node.js microservices, PostgreSQL, Stripe integration, and WebSocket notifications.',
      '**E-Commerce Platform with Realtime Inventory:** Microservices, Redis cache, RabbitMQ event queue, and Elasticsearch product search.'
    ],
    interviewRounds: [
      '**Round 1:** Machine Coding Round (Build a functional component or miniature app in 90 min)',
      '**Round 2:** Core JS/React internals + Backend REST/Database design',
      '**Round 3:** System Architecture & Cultural fit'
    ],
    topCompanies: ['Razorpay', 'CRED', 'Swiggy', 'Freshworks', 'Zerodha', 'Postman', 'InMobi']
  },

  'cloud devops': {
    title: 'Cloud & DevOps Engineer',
    emoji: '☁️',
    category: 'Cloud Infrastructure & SRE',
    demand: 'Explosive growth as enterprise workloads migrate to cloud',
    avgSalary: '₹7.5–22 LPA',
    summary: 'Cloud & DevOps Engineers automate build, test, and release pipelines while managing highly available, fault-tolerant cloud infrastructure.',
    roadmap: [
      {
        phase: 'Phase 1: Linux, Networking & Scripting (Month 1–2)',
        items: ['Advanced Linux administration & permissions', 'Computer networking: Subnets, VPC, DNS, Gateways, Firewalls', 'Bash scripting & Python automation']
      },
      {
        phase: 'Phase 2: Containers & Cloud Platforms (Month 3–4)',
        items: ['Docker deep dive: multi-stage builds, networking, volumes', 'AWS Core Services (EC2, S3, IAM, VPC, RDS, Lambda) or GCP equivalents', 'Infrastructure as Code: Terraform fundamentals']
      },
      {
        phase: 'Phase 3: Orchestration, CI/CD & Observability (Month 5–6)',
        items: ['Kubernetes (Pods, Deployments, Services, Ingress, Helm)', 'CI/CD with GitHub Actions & GitLab CI', 'Monitoring: Prometheus & Grafana, ELK Stack']
      }
    ],
    skills: [
      { name: 'Linux & Shell Scripting', score: 90, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'Docker & Kubernetes', score: 85, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'AWS / GCP Cloud Services', score: 80, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'Terraform (IaC)', score: 70, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'CI/CD & Observability', score: 70, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' }
    ],
    projects: [
      '**GitOps Kubernetes Deployment:** Automated zero-downtime deployment pipeline using ArgoCD, Helm, and GitHub Actions on AWS EKS.',
      '**Terraform Multi-Tier Cloud Infrastructure:** Modular infrastructure provisioning VPC, bastion host, autoscaling EC2 group, and RDS cluster.'
    ],
    interviewRounds: [
      '**Round 1:** Linux commands, networking scenarios & shell scripting',
      '**Round 2:** Containerization, Dockerfile optimization, Kubernetes troubleshooting',
      '**Round 3:** High-availability architecture, Disaster recovery & Security best practices'
    ],
    topCompanies: ['Red Hat', 'AWS', 'Microsoft Azure', 'Deloitte', 'Accenture Cloud', 'Cognizant', 'Siemens']
  }
};

// ---- State ---- //
let currentModule = 'career';
let isTyping = false;

// ---- Init ---- //
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  updateQuickPrompts();
  setupScrollAnimations();
  setupNavHighlight();
  initSkillBarsDemo();
});

function initChat() {
  const mod = modules[currentModule];
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  addMessage('ai', mod.greeting, true);
}

function switchModule(moduleKey, btn) {
  currentModule = moduleKey;
  document.querySelectorAll('.module-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const mod = modules[moduleKey];
  document.getElementById('chatStatus').textContent = mod.statusLabel;
  clearChat();
  updateQuickPrompts();
}

function updateQuickPrompts() {
  const mod = modules[currentModule];
  const list = document.getElementById('quickPromptList');
  list.innerHTML = mod.quickPrompts.map(p =>
    `<button class="quick-prompt" onclick="sendQuickPrompt('${p.replace(/'/g, "\\'")}')">${p}</button>`
  ).join('');
}

function sendQuickPrompt(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

function clearChat() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  addMessage('ai', modules[currentModule].greeting, true);
}

// ---- Message Rendering & Formatting ---- //
function addMessage(sender, text, instant = false) {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.innerHTML = `
    <div class="msg-icon">${sender === 'ai' ? 'CC' : '👤'}</div>
    <div class="message-content">${formatMessage(text)}</div>
  `;
  if (!instant) div.style.opacity = '0';
  chatMessages.appendChild(div);

  if (!instant) {
    requestAnimationFrame(() => { div.style.opacity = '1'; });
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#{1,4} (.+)$/gm, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-size:0.85em;">$1</code>');
}

function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message ai';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-icon">CC</div>
    <div class="ai-thinking">
      <span>Campus Compass is generating response</span>
      <div class="thinking-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

// ---- Send Message Handler ---- //
async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text || isTyping) return;

  input.value = '';
  input.style.height = 'auto';
  addMessage('user', text);

  isTyping = true;
  document.getElementById('sendBtn').disabled = true;
  showTypingIndicator();

  // Natural response latency
  const delay = 600 + Math.random() * 500;
  await sleep(delay);

  removeTypingIndicator();

  const result = generateIntelligentResponse(text);
  const msgEl = addMessage('ai', result.text);

  // If role skills or custom visual components are included, attach them
  if (result.skills && result.skills.length > 0) {
    renderDynamicSkillBars(msgEl.querySelector('.message-content'), result.roleName, result.skills);
  }

  // If follow-up action chips exist, render them
  if (result.actionChips && result.actionChips.length > 0) {
    renderActionChips(msgEl.querySelector('.message-content'), result.actionChips);
  }

  isTyping = false;
  document.getElementById('sendBtn').disabled = false;
}

// ---- Context-Aware Semantic Brain ---- //
function generateIntelligentResponse(userInput) {
  const text = userInput.trim();
  const lower = text.toLowerCase();
  userProfile.interactionCount++;

  // 1. Extract and store any profile entities dynamically
  extractUserProfileEntities(lower, text);

  // 2. Identify target role matches
  let detectedRoleKey = null;
  if (lower.includes('data engineer') || lower.includes('data engineering')) detectedRoleKey = 'data engineer';
  else if (lower.includes('data scientist') || lower.includes('data science') || lower.includes('data analyst')) detectedRoleKey = 'data scientist';
  else if (lower.includes('software engineer') || lower.includes('sde') || lower.includes('swe') || lower.includes('software developer')) detectedRoleKey = 'software engineer';
  else if (lower.includes('full stack') || lower.includes('fullstack') || lower.includes('web developer')) detectedRoleKey = 'full stack';
  else if (lower.includes('devops') || lower.includes('cloud engineer') || lower.includes('sre')) detectedRoleKey = 'cloud devops';

  if (detectedRoleKey) {
    userProfile.targetRole = detectedRoleKey;
  }

  // Use stored role if user refers to "it" or asks follow-ups like "how to prepare" or "skills needed"
  const activeRole = detectedRoleKey || userProfile.targetRole;
  const roleData = activeRole ? careerRoleKnowledge[activeRole] : null;

  // 3. Check for specific question types about the role

  // A. Direct Goal Declaration: "I want to become a [role]" or "Roadmap for [role]"
  if (detectedRoleKey && (lower.includes('want to become') || lower.includes('how to become') || lower.includes('roadmap') || lower.includes('career as') || lower.includes('guidance') || userProfile.interactionCount === 1 || !userProfile.lastIntent)) {
    userProfile.lastIntent = 'role_overview';
    return buildRoleRoadmapResponse(roleData);
  }

  // B. Specific inquiry about skills or skill gap for current role
  if (lower.includes('skill') || lower.includes('tech stack') || lower.includes('tools') || lower.includes('what should i learn') || currentModule === 'skill') {
    userProfile.lastIntent = 'skills';
    if (roleData) {
      return buildRoleSkillsResponse(roleData);
    }
  }

  // C. Projects inquiry for target role
  if (lower.includes('project') || lower.includes('portfolio') || lower.includes('build') || lower.includes('github')) {
    userProfile.lastIntent = 'projects';
    if (roleData) {
      return buildRoleProjectsResponse(roleData);
    }
  }

  // D. Interview preparation or questions for target role
  if (lower.includes('interview') || lower.includes('questions') || lower.includes('rounds') || lower.includes('test') || currentModule === 'interview') {
    userProfile.lastIntent = 'interview';
    if (roleData) {
      return buildRoleInterviewResponse(roleData);
    }
  }

  // E. Salary, placement companies, or eligibility
  if (lower.includes('salary') || lower.includes('lpa') || lower.includes('package') || lower.includes('companies') || lower.includes('who hires') || lower.includes('drives') || currentModule === 'placement') {
    userProfile.lastIntent = 'placement';
    if (roleData) {
      return buildRolePlacementResponse(roleData);
    }
  }

  // F. Resume advice for the target role
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('ats') || lower.includes('summary') || currentModule === 'resume') {
    userProfile.lastIntent = 'resume';
    if (roleData) {
      return buildRoleResumeResponse(roleData);
    }
  }

  // G. Contextual conversational follow-ups: user provided branch/year or background
  if (userProfile.branch || userProfile.year) {
    if (roleData) {
      return {
        text: `Got it! Given that you are in **${userProfile.branch ? userProfile.branch.toUpperCase() : 'Engineering'}${userProfile.year ? ' (' + userProfile.year + ')' : ''}**, here is how to customize your journey toward **${roleData.title}**:\n\n` +
          `✅ **Academic Alignment:** Focus on subjects like Database Management Systems, Distributed Systems, and Data Structures.\n` +
          `⏱️ **Time Investment:** 8–10 hours per week dedicated to hands-on SQL and ${roleData.title === 'Data Engineer' ? 'PySpark' : 'core programming'}.\n` +
          `🎯 **Immediate Actionable Step:** Start with LeetCode SQL 50 and set up a local Docker container for database practice.\n\n` +
          `Would you like me to generate your **project roadmap**, **interview checklist**, or **recommended certifications** next?`,
        actionChips: [
          `Projects for ${roleData.title}`,
          `Interview questions for ${roleData.title}`,
          `Top companies hiring ${roleData.title}`
        ]
      };
    }
  }

  // H. Check if the question matches generic module-specific databases
  const moduleResponse = checkGeneralKnowledge(lower, text);
  if (moduleResponse) {
    return moduleResponse;
  }

  // I. Intelligent Fallback with Adaptive Context
  return buildAdaptiveHelpResponse(activeRole);
}

// ---- Entity Extractor ---- //
function extractUserProfileEntities(lower, text) {
  // Extract branch
  if (lower.includes('cse') || lower.includes('computer science')) userProfile.branch = 'CSE';
  else if (lower.includes('ece') || lower.includes('electronics')) userProfile.branch = 'ECE';
  else if (lower.includes('it') || lower.includes('information technology')) userProfile.branch = 'IT';
  else if (lower.includes('mechanical') || lower.includes('mech')) userProfile.branch = 'Mechanical';
  else if (lower.includes('civil')) userProfile.branch = 'Civil';
  else if (lower.includes('ee') || lower.includes('electrical')) userProfile.branch = 'Electrical';

  // Extract college year
  if (lower.includes('1st year') || lower.includes('first year')) userProfile.year = '1st Year';
  else if (lower.includes('2nd year') || lower.includes('second year')) userProfile.year = '2nd Year';
  else if (lower.includes('3rd year') || lower.includes('third year')) userProfile.year = '3rd Year';
  else if (lower.includes('4th year') || lower.includes('final year')) userProfile.year = 'Final Year';

  // Extract company if mentioned
  const companies = ['google', 'amazon', 'microsoft', 'tcs', 'infosys', 'wipro', 'flipkart', 'walmart'];
  for (const comp of companies) {
    if (lower.includes(comp)) {
      userProfile.targetCompany = comp.charAt(0).toUpperCase() + comp.slice(1);
      break;
    }
  }
}

// ---- Specialized Response Builders ---- //
function buildRoleRoadmapResponse(role) {
  let phasesText = '';
  role.roadmap.forEach(phase => {
    phasesText += `\n**${phase.phase}**\n` + phase.items.map(item => `- ${item}`).join('\n') + '\n';
  });

  return {
    text: `🎯 **Excellent choice! Becoming a ${role.title} is a high-growth career decision.**\n\n` +
      `**Role Summary:** ${role.summary}\n` +
      `📈 **Market Demand:** ${role.demand}\n` +
      `💰 **Expected Package:** ${role.avgSalary}\n\n` +
      `---\n` +
      `### 🗺️ Your Step-by-Step ${role.title} Preparation Roadmap\n` +
      phasesText + `\n` +
      `🏢 **Top Hiring Companies:** ${role.topCompanies.join(', ')}\n\n` +
      `*Below are the core technical competencies you'll need. Click any quick action below to dive deeper:*`,
    roleName: role.title,
    skills: role.skills,
    actionChips: [
      `Projects to build for ${role.title}`,
      `Interview questions for ${role.title}`,
      `Resume keywords for ${role.title}`,
      `Top companies hiring ${role.title}`
    ]
  };
}

function buildRoleSkillsResponse(role) {
  return {
    text: `⚡ **Technical Competencies & Skill Gap Analysis for ${role.title}:**\n\n` +
      `To get placed as a ${role.title} in top product & tech companies, recruiters look for proficiency in these distinct tiers:\n\n` +
      `🔴 **Tier 1 (Mandatory Screeners):**\n` +
      `- Advanced SQL (Window functions, CTEs, Joins, Indexing)\n` +
      `- Core Programming (Python / Scala with OOP & Data Structures)\n\n` +
      `🟡 **Tier 2 (Core System Competency):**\n` +
      `- Distributed Computing (Apache Spark / PySpark)\n` +
      `- Data Warehousing (Snowflake, BigQuery, or Amazon Redshift)\n` +
      `- Workflow Orchestration (Apache Airflow DAGs)\n\n` +
      `🟢 **Tier 3 (Hiring Differentiators):**\n` +
      `- Stream processing basics (Apache Kafka)\n` +
      `- Containerization & Cloud (Docker, AWS S3/Glue/EMR)\n\n` +
      `*Take a look at your target skill benchmark below:*`,
    roleName: role.title,
    skills: role.skills,
    actionChips: [
      `How to practice SQL for ${role.title}`,
      `Projects to build for ${role.title}`,
      `Mock interview for ${role.title}`
    ]
  };
}

function buildRoleProjectsResponse(role) {
  return {
    text: `🛠️ **Top Portfolio Projects That Get ${role.title} Interviews:**\n\n` +
      `Recruiters discard generic tutorials. These **end-to-end, production-style projects** demonstrate real engineering capability on your GitHub:\n\n` +
      role.projects.map((p, i) => `${i + 1}. ${p}`).join('\n\n') + `\n\n` +
      `💡 **Pro Tip for Placements:** Always include an architectural diagram in your GitHub README, write clean documentation, and add automated data quality tests (e.g., Great Expectations).`,
    actionChips: [
      `Interview questions for ${role.title}`,
      `Resume keywords for ${role.title}`,
      `Top companies hiring ${role.title}`
    ]
  };
}

function buildRoleInterviewResponse(role) {
  return {
    text: `🎙️ **Interview Process & Key Questions for ${role.title}:**\n\n` +
      `Here is the standard 3-round evaluation pipeline at leading tech companies:\n\n` +
      role.interviewRounds.map(r => `- ${r}`).join('\n') + `\n\n` +
      `🔥 **High-Frequency Technical Questions Asked in 2024–2025:**\n` +
      `1. *"How do you handle data skewness in Apache Spark joins?"*\n` +
      `2. *"Write a SQL query using `DENSE_RANK()` and `LEAD()` to detect user retention patterns."*\n` +
      `3. *"Explain the difference between Row-oriented (Postgres) vs Columnar (Parquet/Snowflake) storage."*\n` +
      `4. *"How would you architect a fault-tolerant pipeline that ingests 50 million events per day?"*\n\n` +
      `Would you like to simulate answering one of these technical questions now?`,
    actionChips: [
      `Simulate SQL technical question`,
      `Explain Spark data skewness`,
      `How to structure STAR answers`
    ]
  };
}

function buildRolePlacementResponse(role) {
  return {
    text: `🏢 **Placement & Hiring Landscape for ${role.title}:**\n\n` +
      `| Metric | Details |\n` +
      `|---|---|\n` +
      `| **Average CTC** | ${role.avgSalary} |\n` +
      `| **Hiring Surge** | August to November (Campus) & Jan to April (Off-Campus) |\n` +
      `| **Typical Eligibility** | 60%+ throughout (10th, 12th, B.Tech/BE), No active backlogs |\n\n` +
      `**Major Companies Hiring for this Role:**\n` +
      role.topCompanies.map(c => `- **${c}**`).join('\n') + `\n\n` +
      `**Off-Campus Hunting Strategy:**\n` +
      `- Reach out to Data Engineering leads on LinkedIn with your GitHub Lakehouse project link\n` +
      `- Apply directly through company career portals using employee referrals`,
    actionChips: [
      `Projects to build for ${role.title}`,
      `Resume keywords for ${role.title}`,
      `Mock interview for ${role.title}`
    ]
  };
}

function buildRoleResumeResponse(role) {
  return {
    text: `📝 **ATS Optimization & Resume Guide for ${role.title}:**\n\n` +
      `To ensure your resume passes ATS keyword screening and catches the recruiter's eye:\n\n` +
      `🔑 **Mandatory Keywords to Include:**\n` +
      `\`SQL\`, \`PySpark\`, \`Data Modeling\`, \`ETL/ELT Pipelines\`, \`Apache Airflow\`, \`Snowflake\`, \`AWS S3\`, \`Kafka\`, \`Distributed Systems\`\n\n` +
      `⭐ **How to Write Impactful Bullet Points (Google XYZ Formula):**\n` +
      `❌ *Weak:* "Created ETL pipelines using Python and SQL for data analysis."\n` +
      `✅ *Strong:* "Architected automated PySpark ETL pipeline on AWS S3 processing **12M+ rows daily**, reducing query latency by **38%** through columnar Parquet partitioning and Airflow scheduling."\n\n` +
      `Want me to review your draft resume bullet point? Just paste it here!`,
    actionChips: [
      `Review my project bullet point`,
      `Interview questions for ${role.title}`,
      `Projects to build for ${role.title}`
    ]
  };
}

// ---- General Knowledge Checker ---- //
function checkGeneralKnowledge(lower, text) {
  // Placement drives
  if (lower.includes('upcoming') || lower.includes('placement drives') || lower.includes('drive schedule')) {
    return {
      text: modules['placement'].responses['upcoming'],
      actionChips: ['How to prepare for TCS', 'Amazon SDE eligibility', 'Infosys hiring pattern']
    };
  }
  // Company specifics
  if (lower.includes('tcs')) {
    return {
      text: modules['placement'].responses['tcs'],
      actionChips: ['TCS NQT syllabus', 'Coding questions for TCS', 'Show upcoming drives']
    };
  }
  if (lower.includes('amazon')) {
    return {
      text: modules['interview'].responses['amazon'],
      actionChips: ['Amazon Leadership Principles', 'STAR method framework', 'SDE technical rounds']
    };
  }
  if (lower.includes('google')) {
    return {
      text: modules['skill'].responses['google'],
      actionChips: ['Google coding prep roadmap', 'System design basics', 'LeetCode strategy']
    };
  }
  if (lower.includes('ats')) {
    return {
      text: modules['resume'].responses['ats'],
      actionChips: ['Action verbs for resume', 'Sample resume summary', 'Review my project description']
    };
  }
  if (lower.includes('star method') || lower.includes('star format')) {
    return {
      text: modules['interview'].responses['star'],
      actionChips: ['Practice a behavioral question', 'Tell me about yourself framework']
    };
  }
  if (lower.includes('tell me about yourself')) {
    return {
      text: modules['interview'].responses['tell me about yourself'],
      actionChips: ['Practice STAR answer', 'Amazon interview simulation']
    };
  }

  // Branch queries
  if (lower.includes('cse') || lower.includes('computer science')) {
    return {
      text: modules['career'].responses['cse'],
      actionChips: ['I want to become a Data Engineer', 'I want to become an AI/ML Engineer', 'Full-Stack Developer path']
    };
  }

  return null;
}

// ---- Adaptive Fallback Response ---- //
function buildAdaptiveHelpResponse(activeRole) {
  if (activeRole) {
    const role = careerRoleKnowledge[activeRole];
    return {
      text: `I'm tracking your target role as **${role.title}**! Here is what we can do next:\n\n` +
        `- 🗺️ **Roadmap:** Ask *"Give me a month-by-month prep schedule"*\n` +
        `- ⚡ **Skills:** Ask *"What specific tools should I master first?"*\n` +
        `- 🛠️ **Projects:** Ask *"What projects should I put on my resume?"*\n` +
        `- 🎙️ **Interview:** Ask *"Give me technical interview questions for ${role.title}"*\n` +
        `- 🏢 **Placements:** Ask *"Which companies hire freshers for this role?"*\n\n` +
        `What would you like to explore next?`,
      actionChips: [
        `Projects for ${role.title}`,
        `Interview questions for ${role.title}`,
        `Resume keywords for ${role.title}`
      ]
    };
  }

  return {
    text: `I can help you build a personalized career and placement preparation plan!\n\n` +
      `**Popular Career Tracks You Can Explore:**\n` +
      `- 🏗️ **Data Engineer** (Distributed Systems, SQL, PySpark, Cloud)\n` +
      `- 📊 **Data Scientist** (Machine Learning, Python, Predictive Modeling)\n` +
      `- 💻 **Software Engineer (SDE)** (DSA, System Design, Backend APIs)\n` +
      `- ⚡ **Full-Stack Developer** (React, Node.js, Web Architecture)\n` +
      `- ☁️ **Cloud & DevOps** (AWS, Docker, Kubernetes, CI/CD)\n\n` +
      `*Tell me which track interests you, or paste any question about placements, interviews, or resumes!*`,
    actionChips: [
      'I want to become a Data Engineer',
      'I want to become a Software Engineer',
      'Show upcoming placement drives',
      'How to optimize my resume for ATS'
    ]
  };
}

// ---- Dynamic UI Helpers (Skill Bars & Action Chips) ---- //
function renderDynamicSkillBars(container, roleName, skills) {
  const barsHtml = `
    <div style="margin-top:16px;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;display:flex;align-items:center;gap:6px;">
        <span>📊</span> <strong>Target Skill Benchmark for ${roleName}:</strong>
      </p>
      <div class="skill-bars">
        ${skills.map(s => `
          <div class="skill-bar-item">
            <div class="skill-bar-label">
              <span style="font-size:0.8rem;font-weight:500;">${s.name}</span>
              <span style="font-size:0.8rem;font-weight:600;color:${s.score >= 85 ? 'var(--cyan)' : s.score >= 70 ? 'var(--green)' : 'var(--orange)'}">${s.score}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" style="width:0%;background:${s.color}" data-target="${s.score}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', barsHtml);

  // Animate skill bars
  setTimeout(() => {
    container.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 100);
}

function renderActionChips(container, chips) {
  const chipsHtml = `
    <div class="chat-action-chips" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;">
      ${chips.map(chip => `
        <button 
          class="action-chip" 
          onclick="sendQuickPrompt('${chip.replace(/'/g, "\\'")}')"
          style="background:rgba(108,58,255,0.15);border:1px solid rgba(108,58,255,0.35);color:var(--purple-light);border-radius:20px;padding:6px 14px;font-size:0.78rem;cursor:pointer;transition:all 0.2s ease;font-weight:500;"
          onmouseover="this.style.background='rgba(108,58,255,0.3)';this.style.borderColor='var(--purple-light)';"
          onmouseout="this.style.background='rgba(108,58,255,0.15)';this.style.borderColor='rgba(108,58,255,0.35)';"
        >
          ${chip} →
        </button>
      `).join('')}
    </div>
  `;
  container.insertAdjacentHTML('beforeend', chipsHtml);
}

// ---- Tab Switching ---- //
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ---- Scroll Animations ---- //
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .benefit-card, .uc-card, .bp-card, .tech-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

document.addEventListener('scroll', () => {
  document.querySelectorAll('.feature-card.visible, .benefit-card.visible, .uc-card.visible, .bp-card.visible, .tech-category.visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}, { passive: true });

const styleEl = document.createElement('style');
styleEl.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleEl);

// ---- Nav Highlight ---- //
function setupNavHighlight() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(8,11,20,0.95)';
    } else {
      navbar.style.background = 'rgba(8,11,20,0.7)';
    }
  }, { passive: true });
}

// ---- Scroll to Demo ---- //
function scrollToDemo() {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('userInput').focus(), 800);
}

// ---- Keyboard Handler ---- //
function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ---- Skill Bars Demo (Architecture Section) ---- //
function initSkillBarsDemo() {
  const archObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.arch-node').forEach((node, i) => {
          setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.3 });

  const archDiagram = document.querySelector('.arch-diagram');
  if (archDiagram) {
    archDiagram.querySelectorAll('.arch-node').forEach(node => {
      node.style.opacity = '0';
      node.style.transform = 'translateY(10px)';
      node.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    archObserver.observe(archDiagram);
  }
}

// ---- Utility ---- //
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Mobile Menu ---- //
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'rgba(8,11,20,0.97)';
    navLinks.style.padding = '16px';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
  });
}
