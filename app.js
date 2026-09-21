/* ===================================
   CAMPUS COMPASS — Interactive JS
   =================================== */

// ---- Module Data ---- //
const modules = {
  career: {
    name: 'Career Navigator',
    icon: '🧭',
    statusLabel: '● Active — Career Navigator Mode',
    quickPrompts: [
      'What careers suit a CSE student?',
      'I want to become a Data Scientist',
      'Compare Software Engineer vs Product Manager',
      'What\'s the scope of AI/ML in India?',
    ],
    greeting: `👋 Hi! I'm **Campus Compass AI**, your personal career guide.\n\nI can help you:\n- 🗺️ **Map career paths** based on your skills & interests\n- 📊 **Analyze market trends** for different roles\n- 🎯 **Create personalized roadmaps** step by step\n\nTell me your branch, interests, or the career you're curious about — let's explore together!`,
    responses: {
      'data scientist': `🎯 **Excellent choice!** Data Science is one of the top 5 in-demand careers in India right now.\n\nHere's your **Personalized Career Roadmap**:\n\n**Phase 1: Foundation (0–3 months)**\n- Python programming (NumPy, Pandas, Matplotlib)\n- Statistics & Probability fundamentals\n- SQL & Database basics\n\n**Phase 2: Core ML (3–6 months)**\n- Machine Learning algorithms (Scikit-learn)\n- Feature engineering & model evaluation\n- Kaggle competitions for practice\n\n**Phase 3: Advanced (6–12 months)**\n- Deep Learning (TensorFlow/PyTorch)\n- NLP & Computer Vision projects\n- Build a portfolio with 3 end-to-end projects\n\n**Top Hiring Companies:** Google, Amazon, Flipkart, Mu Sigma, Fractal Analytics\n\n📈 **Average Starting Salary:** ₹8–18 LPA\n\nWant me to identify your current skill gaps for this path?`,

      'cse': `👨‍💻 **CSE opens incredible doors!** Here are the **top 6 career paths** trending for CSE graduates:\n\n1. 🤖 **AI/ML Engineer** — ₹12–35 LPA | Very High Demand\n2. ☁️ **Cloud Solutions Architect** — ₹10–30 LPA | High Demand\n3. 🔒 **Cybersecurity Specialist** — ₹8–25 LPA | Rapidly Growing\n4. 📱 **Full-Stack Developer** — ₹6–20 LPA | Always in Demand\n5. 🧑‍💼 **Product Manager** — ₹10–40 LPA | High Impact\n6. 📊 **Data Scientist** — ₹8–22 LPA | Booming Field\n\n*Which of these excites you the most? I'll create a detailed roadmap!*`,

      'software engineer': `💻 **Software Engineering** is the backbone of the tech industry — here's the full path:\n\n**Must-Have Skills for 2025 Placements:**\n- ✅ Data Structures & Algorithms (LeetCode 200+ problems)\n- ✅ System Design (for senior roles)\n- ✅ At least one backend language (Java/Go/Node.js)\n- ✅ Cloud basics (AWS/GCP/Azure)\n- ✅ Version control (Git)\n\n**Top Platforms to Practice:**\n- LeetCode, HackerRank, Codeforces\n- System Design: Grokking the System Design Interview\n\n**Interview Process at Top Companies (Google/Amazon/Microsoft):**\n1. Online Coding Round\n2. Technical Phone Screen (2 rounds)\n3. System Design\n4. Behavioral/HR\n\nShall I give you a 90-day preparation plan?`,

      'default': `I understand you're exploring career options. Let me help with some key insights:\n\n**To give you the most personalized advice, tell me:**\n- 🎓 Your branch/specialization\n- ⭐ Your interests (coding, design, business, research?)\n- 🎯 Any specific role or company in mind\n- 📅 Which year of college are you in?\n\nThe more you share, the more precise my guidance will be! 🚀`
    }
  },
  resume: {
    name: 'Resume Analyzer',
    icon: '📝',
    statusLabel: '● Active — Resume Analyzer Mode',
    quickPrompts: [
      'How do I improve my ATS score?',
      'What skills to add for a Dev role?',
      'Help me write a strong summary',
      'Review my projects section',
    ],
    greeting: `📝 Welcome to the **Resume Intelligence Engine**!\n\nI can help you:\n- 🎯 **Score your resume** against ATS systems\n- 🔍 **Identify keyword gaps** for specific roles\n- ✍️ **Rewrite weak sections** to pack more punch\n- 📊 **Estimate shortlist probability** for target roles\n\nDescribe your resume, share your target role, or paste a job description — I'll give you an instant analysis!`,
    responses: {
      'ats': `📊 **ATS Optimization Guide — Key Rules to Follow:**\n\n**Your current ATS score is likely LOW if you:**\n- ❌ Use tables, columns, or graphics\n- ❌ Have a PDF with non-selectable text\n- ❌ Use headers like "Career Objective" instead of "Summary"\n- ❌ Lack role-specific keywords\n\n**Boost your ATS score with these fixes:**\n1. ✅ Use a single-column, clean format\n2. ✅ Mirror keywords from the JD verbatim\n3. ✅ Use standard section headers (Experience, Skills, Education)\n4. ✅ Quantify all achievements (e.g., "Improved performance by 40%")\n5. ✅ Include both acronyms and full forms (e.g., "ML / Machine Learning")\n\n**Estimated Score Improvement: +25–35 points** 🎯\n\nShare your target role and I'll extract the exact keywords you need!`,

      'summary': `✍️ **Crafting a Powerful Professional Summary:**\n\nThe formula that works:\n> *"[Your Title] with [X years/months] of experience in [Key Skills]. Proven track record of [Achievement]. Passionate about [Interest Area]. Seeking [Target Role] at [Type of Company]."*\n\n**Before (weak):**\n> "I am a final year CSE student looking for a software engineering job."\n\n**After (powerful):**\n> "Results-driven Software Engineer with expertise in full-stack development (React, Node.js, Python). Built 3 production-ready apps serving 500+ users. Google Summer of Code 2024 contributor. Seeking SDE role at product-first tech companies to drive impactful engineering solutions."\n\n📈 This version is **8x more likely** to pass the HR screening filter.\n\nWant me to write your personalized summary? Share your experience and skills!`,

      'default': `I'm your resume intelligence engine! Here's what I need to give you a full analysis:\n\n**Quick Analysis Options:**\n1. 📋 Describe your resume content → I'll identify weak areas\n2. 🎯 Share a job description → I'll extract missing keywords\n3. 📝 Tell me your target role → I'll give tailored advice\n\n**Common Resume Mistakes I Catch:**\n- Generic objective statements\n- Missing quantified achievements\n- Poor keyword density for ATS\n- Outdated skill listings\n- Formatting issues affecting parsing\n\nWhat would you like to work on first?`
    }
  },
  interview: {
    name: 'Mock Interview',
    icon: '🎙️',
    statusLabel: '● Active — Mock Interview Mode',
    quickPrompts: [
      'Start an Amazon SDE interview',
      'Practice HR round questions',
      'Tell me about yourself tips',
      'STAR method explained',
    ],
    greeting: `🎙️ **Mock Interview Coach is Ready!**\n\nI'll conduct a realistic interview session tailored to your target company and role.\n\n**What I simulate:**\n- 🏢 Company-specific technical rounds\n- 🤝 HR & behavioral interviews\n- 💻 Coding problem walkthroughs\n- 🧠 Case studies & system design\n\n**After each answer you'll get:**\n- Score: Clarity / Technical / Structure\n- Feedback on improvement areas\n- Sample ideal answer\n\nWhich company and role are you preparing for?`,
    responses: {
      'amazon': `🏢 **Amazon SDE Interview Simulation — Starting Now!**\n\nAmazon follows the **Leadership Principles** framework. I'll test both technical skills and cultural fit.\n\n---\n**Round 1, Question 1 (Warm-up — Behavioral):**\n\n*"Tell me about a time when you had to work with a difficult team member to deliver a project. How did you handle it?"*\n\n💡 **Tip:** Use the **STAR format** — Situation, Task, Action, Result\n\nTake your time and give me your answer below. I'll score it on:\n- **Clarity** (How well you communicate)\n- **Structure** (STAR format adherence)\n- **Impact** (Measurability of result)\n\n*Press Enter when you're ready to answer, or type "skip" to get a sample answer!*`,

      'tell me about yourself': `📝 **"Tell Me About Yourself" — Master Framework:**\n\n**The Perfect 90-Second Structure:**\n\n1️⃣ **Present** (20 sec) — Who you are + current role/year\n2️⃣ **Past** (30 sec) — 2 key experiences/projects that are relevant\n3️⃣ **Future** (20 sec) — Why this role/company excites you\n4️⃣ **Transition** (10 sec) — Hand it back to the interviewer\n\n**Example:**\n> "I'm Priya, a final-year Computer Science student at NIT Trichy. This past summer, I interned at Zoho where I built a real-time analytics dashboard handling 100K events/day. I've also led our college's Coding Club for 2 years, organizing events for 500+ students. I'm drawn to Amazon because of its customer-obsession culture and the scale of engineering challenges — I believe my backend experience and problem-solving approach align perfectly with the SDE-I role. I'm excited to dive into the technical questions!"\n\n**Score this example: 9.2/10** ✅\n\nShall we practice your personalized version?`,

      'star': `⭐ **The STAR Method — Your Answer Framework:**\n\n| Component | What to Cover | Time |
|-----------|--------------|------|
| **S**ituation | Context, team size, timeline | 15% |
| **T**ask | Your specific responsibility | 15% |
| **A**ction | Steps YOU took (not "we") | 50% |
| **R**esult | Quantified outcome + learning | 20% |\n\n**Power Tips:**\n- ✅ Always use "I" not "we" during Action\n- ✅ Quantify results: "reduced by 30%", "saved 4 hours/week"\n- ✅ Mention what you learned or would do differently\n- ❌ Never skip the Result — it's what interviewers remember\n\n**Practice this question using STAR:**\n*"Describe a time you identified and fixed a critical bug under pressure."*`,

      'default': `Let's get you ready for your interview! I can simulate:\n\n**Company-Specific Rounds:**\n- 🏢 Google, Amazon, Microsoft, Flipkart\n- 🚀 Startup interviews (fast-paced, practical)\n- 🏦 Product companies vs Service companies\n\n**Types of Interview Practice:**\n- 💻 DSA / Coding problems\n- 🏗️ System Design (for 3rd/4th year)\n- 🧠 HR & Behavioral (STAR-based)\n- 🎯 Domain-specific (Data Science, Frontend, etc.)\n\nTell me: **Which company, which role, and what round?**\nI'll create the most realistic simulation for you!`
    }
  },
  skill: {
    name: 'Skill Gap Detector',
    icon: '⚡',
    statusLabel: '● Active — Skill Gap Detector Mode',
    quickPrompts: [
      'I want to become a Full-Stack Dev',
      'Skills for Google SWE intern',
      'What Python libraries should I learn?',
      'Is my profile ready for placements?',
    ],
    greeting: `⚡ **Skill Gap Detector — Online!**\n\nI analyze your current skills vs. what the job market requires, then give you a **precise action plan**.\n\n**How it works:**\n1. Tell me your current skills & year of study\n2. Share your target role or paste a JD\n3. I'll generate a **priority-ranked skill gap report**\n4. Get curated free & paid resources to fill each gap\n\n**Ready? Tell me about yourself and your target role!**`,
    responses: {
      'full stack': `🔍 **Skill Gap Analysis — Full-Stack Developer Role**\n\nBased on 500+ Full-Stack job descriptions analyzed:\n\n**Required Skill Coverage:**`,
      'google': `🏔️ **Google SWE Intern — Skill Requirements Analysis:**\n\n**Critical Skills (Must Have):**\n- ⚡ Data Structures & Algorithms — *Very High Priority*\n- 🧠 Problem-solving on Leetcode (Medium/Hard level)\n- 💻 At least one language (C++/Java/Python) — expert level\n- 📐 Object-Oriented Design fundamentals\n\n**Important but Secondary:**\n- System design basics (for intern level: simplified)\n- Open source contributions (bonus)\n- Competitive programming history\n\n**Typical Google Intern Interview Path:**\n1. Online coding assessment (2 coding problems, 75 min)\n2. 2× Technical Phone Screens (45 min each, 1 coding problem each)\n3. Offer!\n\n**Your 12-Week Prep Roadmap:**\n- Weeks 1–4: 50 Easy + 30 Medium LeetCode problems\n- Weeks 5–8: 50 Medium + 20 Hard problems, topic-wise\n- Weeks 9–12: Mock interviews, company-specific patterns\n\n📚 **Resources:** NeetCode 150, CLRS textbook, Striver's A2Z Sheet`,

      'default': `I'll analyze your skill gaps right now! To make it precise, tell me:\n\n**Option A — Role-based analysis:**\n> "I want to become a [role]. My current skills are [list them]."\n\n**Option B — JD-based analysis:**\n> Paste the job description and I'll extract every required skill\n\n**Option C — Company-specific:**\n> "What skills do I need for [Company] [Role] placement?"\n\n**I'll give you:**\n- 🔴 Critical gaps (must fix before applying)\n- 🟡 Important gaps (fix within 3 months)\n- 🟢 Nice-to-have (long-term development)\n- 📚 Top 3 resources for each gap (free priority)`
    }
  },
  placement: {
    name: 'Placement Tracker',
    icon: '🏢',
    statusLabel: '● Active — Placement Tracker Mode',
    quickPrompts: [
      'Which companies visit in August?',
      'What is the cutoff CGPA for TCS?',
      'How to prepare for Infosys drive?',
      'Show upcoming placement drives',
    ],
    greeting: `🏢 **Placement Drive Intelligence — Activated!**\n\nI track campus recruitment drives and help you prepare company-by-company.\n\n**I can help you:**\n- 📅 Get drive schedules & eligibility criteria\n- 📋 Access company-specific prep material\n- 🔔 Set reminders for important deadlines\n- 📊 Track your application status\n- 🎯 Match your profile to eligible companies\n\nWhat would you like to know about placements?`,
    responses: {
      'upcoming': `📅 **Upcoming Campus Placement Drives (Sep–Nov 2025):**\n\n| Company | Role | CTC | CGPA | Date |
|---------|------|-----|------|------|
| **TCS** | Systems Engineer | ₹3.6 LPA | 6.0+ | Oct 5 |
| **Infosys** | Systems Engineer | ₹4.9 LPA | 6.5+ | Oct 12 |
| **Wipro** | Project Engineer | ₹3.5 LPA | 6.0+ | Oct 18 |
| **Cognizant** | Programmer Analyst | ₹4.5 LPA | 6.5+ | Nov 2 |
| **Accenture** | ASE | ₹6.5 LPA | 6.0+ | Nov 8 |
| **Amazon** | SDE-1 | ₹18 LPA | 7.0+ | Nov 15 |\n\n⚡ **Eligibility Reminder:** Most companies have a 60% throughout criteria (10th, 12th, UG)\n\nWant a detailed prep guide for any specific company?`,

      'tcs': `🔵 **TCS (Tata Consultancy Services) — Complete Prep Guide:**\n\n**Eligibility:**\n- CGPA: 6.0 and above\n- No active backlogs\n- 60% in 10th and 12th\n\n**Selection Process (4 Rounds):**\n1. 🖥️ **TCS NQT** (90 min) — Aptitude + Coding + Cognitive\n2. 💻 **Technical Interview** — Java/Python basics, DBMS, OS, OOPS\n3. 🗣️ **Managerial Round** — Projects, teamwork scenarios\n4. 🤝 **HR Round** — Offer discussion, salary negotiation\n\n**NQT Pattern:**\n- Verbal Ability: 24 questions\n- Reasoning Ability: 30 questions\n- Numerical Ability: 26 questions\n- Programming Logic: 10 questions\n- Hands-on Coding: 1 problem\n\n**Top Resources:**\n- PrepInsta TCS Mock Tests\n- IndiaBix for Aptitude\n- GeeksforGeeks for Technical\n\n✅ **Your Action Plan:** 2 weeks focused prep is sufficient for TCS!`,

      'default': `📋 **Placement Intelligence Dashboard**\n\nHere's what I can do for you:\n\n**Drive Information:**\n- Upcoming schedules for your college\n- Eligibility criteria by company\n- Package breakdowns and role descriptions\n\n**Company-Specific Prep:**\n- Interview pattern for 50+ companies\n- Previous year questions\n- Cut-off marks & selection rates\n\n**Your Profile Check:**\n- Share your CGPA, branch, skills\n- I'll show companies where you're **eligible right now**\n- And ones to target with 2–3 months prep\n\n*Ask me about any company or say "show upcoming drives"!*`
    }
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

// ---- Message Functions ---- //
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
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-size:0.85em;">$1</code>')
    .replace(/\|(.+)\|/g, (match) => {
      // Simple table rendering
      return match; // Keep as-is for now, handled in CSS
    });
}

function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message ai';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-icon">CC</div>
    <div class="ai-thinking">
      <span>Campus Compass is thinking</span>
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

// ---- Send Message ---- //
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

  // Simulate AI thinking delay
  const delay = 800 + Math.random() * 800;
  await sleep(delay);

  removeTypingIndicator();

  const response = getResponse(text);
  const msgEl = addMessage('ai', response);

  // Add skill bars for full-stack query
  if (text.toLowerCase().includes('full stack') || text.toLowerCase().includes('full-stack')) {
    addSkillBars(msgEl.querySelector('.message-content'));
  }

  isTyping = false;
  document.getElementById('sendBtn').disabled = false;
}

function getResponse(text) {
  const mod = modules[currentModule];
  const lower = text.toLowerCase();

  for (const [key, response] of Object.entries(mod.responses)) {
    if (key !== 'default' && lower.includes(key)) {
      return response;
    }
  }

  // Check cross-module keywords
  if (lower.includes('upcoming') || lower.includes('drives') || lower.includes('schedule')) {
    return modules['placement'].responses['upcoming'];
  }
  if (lower.includes('tcs')) return modules['placement'].responses['tcs'];
  if (lower.includes('amazon')) return modules['interview'].responses['amazon'];
  if (lower.includes('google')) return modules['skill'].responses['google'];
  if (lower.includes('ats')) return modules['resume'].responses['ats'];
  if (lower.includes('star method')) return modules['interview'].responses['star'];

  return mod.responses['default'];
}

function addSkillBars(container) {
  const skills = [
    { name: 'HTML/CSS', score: 90, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
    { name: 'JavaScript/React', score: 75, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
    { name: 'Node.js/Express', score: 60, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
    { name: 'Databases (SQL/NoSQL)', score: 45, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
    { name: 'Docker/DevOps', score: 25, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' },
  ];

  const barsHtml = `
    <div style="margin-top:14px;">
      <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;">📊 <strong>Estimated Skill Coverage for Full-Stack Role:</strong></p>
      <div class="skill-bars">
        ${skills.map(s => `
          <div class="skill-bar-item">
            <div class="skill-bar-label">
              <span style="font-size:0.78rem;">${s.name}</span>
              <span style="font-size:0.78rem;color:${s.score > 70 ? 'var(--green)' : s.score > 50 ? 'var(--orange)' : '#ff6b6b'}">${s.score}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" style="width:0%;background:${s.color}" data-target="${s.score}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted);margin-top:12px;">
        🔴 Critical gaps: Node.js, Databases, DevOps<br/>
        📚 Recommended: The Odin Project (free), Full-Stack Open (free), Scrimba React Course
      </p>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', barsHtml);

  // Animate bars
  setTimeout(() => {
    container.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 100);
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

// Override with simpler class-based approach
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
  // Animate architecture nodes on scroll
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

// ---- Mobile Menu (basic toggle) ---- //
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
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
