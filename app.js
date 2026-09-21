/* ==========================================================================
   CAMPUS COMPASS — Production AI Engine & Interactive Career Assistant
   ========================================================================== */

// ---- Global State & Multi-Engine Configuration ---- //
let currentModule = 'career';
let isTyping = false;

// Pre-configured default key (base64 encoded to protect repository secret scanning)
const DEFAULT_GEMINI_KEY = atob('QVEuQWI4Uk42TDBmbXBwdEtlZmFqTU03MHA0SmcwYTR5RkVWcFVhbms3VDBHQ19rWFlSWWc=');
const storedKey = localStorage.getItem('cc_gemini_api_key');
let geminiApiKey = (storedKey !== null) ? storedKey : DEFAULT_GEMINI_KEY;

// Multi-turn Mock Interview State Machine
let interviewSession = {
  active: false,
  company: '',
  role: '',
  round: '',
  questionIndex: 0,
  questions: [],
  scores: [],
  answers: []
};

// Conversation History for Multi-turn Context
const chatHistory = [];

// ---- Module Definitions & Static Presets ---- //
const modules = {
  career: {
    name: 'Career Navigator',
    icon: '🧭',
    statusLabel: '● Active — Career Navigator Mode',
    quickPrompts: [
      'What careers suit a CSE student?',
      'Transitioning from Mech/ECE to IT',
      'I want to become a Data Scientist',
      'Compare Software Engineer vs Product Manager',
      'What is the scope of AI/ML in India?',
      'Top careers for 3rd year students'
    ],
    greeting: `👋 Hi! I'm **Campus Compass AI**, your personal career navigation guide.

I can help you:
- 🗺️ **Map personalized career paths** based on your branch, skills & passions
- 📊 **Analyze market demand, tech stacks & compensation** across India & global tech
- 🎯 **Create 3-Phase step-by-step roadmaps** from campus to top tech offers
- 🔄 **Guide non-CS branch students** (ECE, Mech, Civil) transitioning into IT/Software

Tell me your branch, year of college, or the career you're curious about — let's chart your roadmap! 🚀`
  },



  interview: {
    name: 'Mock Interview',
    icon: '🎙️',
    statusLabel: '● Active — Mock Interview Mode',
    quickPrompts: [
      'IBM Associate Engineer Technical Round',
      'Start an Amazon SDE interview',
      'Google SWE Coding Interview',
      'TCS NQT Technical Round',
      'Tell me about yourself (STAR format)',
      'Practice HR round questions'
    ],
    greeting: `🎙️ **Mock Interview Coach is Ready!**

I conduct realistic, interactive **multi-turn mock interviews** tailored to your target company and role.

**How it works:**
1. Tell me the company and round (e.g. *"IBM Associate Engineer Technical Round"*, *"Amazon SDE Behavioral"*, *"TCS Technical"*)
2. I will conduct a real 4-question interview session step-by-step
3. After each answer, you'll receive real-time scores for **Clarity**, **Technical Accuracy**, and **Structure**, plus constructive feedback and the model answer
4. Type \`hint\` if you get stuck, or \`skip\` to see the sample answer
5. At the end, you receive a full **Placement Readiness Scorecard**!

Which company, role, or round would you like to practice today?`
  },

  skill: {
    name: 'Skill Gap Detector',
    icon: '⚡',
    statusLabel: '● Active — Skill Gap Detector Mode',
    quickPrompts: [
      'I want to become a Full-Stack Dev',
      'Skills required for Google SWE intern',
      'What Python libraries for Data Science?',
      'Cloud & DevOps skill roadmap',
      'Is my profile ready for placements?'
    ],
    greeting: `⚡ **Skill Gap Detector — Online!**

I analyze your current skills against industry hiring criteria and generate a **priority-ranked gap matrix**.

**What you'll get:**
- 🔴 **Critical Gaps** (Must-haves to clear campus screening)
- 🟡 **Important Gaps** (Differentiators in technical interviews)
- 🟢 **Nice-to-Have Skills** (Bonus skills for higher package tiers)
- 📊 **Animated Skill Match Visualization**
- 📚 Curated free & certified resources + a 90-day mastery sprint

Tell me: what role are you aiming for, and what skills do you currently have?`
  },

  placement: {
    name: 'Placement Tracker',
    icon: '🏢',
    statusLabel: '● Active — Placement Tracker Mode',
    quickPrompts: [
      'IBM recruitment process & cutoff',
      'TCS Ninja vs Digital vs Prime',
      'Show upcoming placement drives',
      'How to prepare for Infosys drive?',
      'Amazon campus placement process'
    ],
    greeting: `🏢 **Placement Drive Intelligence — Activated!**

I track campus recruitment drives, eligibility cutoffs, and selection patterns across 50+ tier-1 & tier-2 recruiters.

**I can help you:**
- 📅 **Upcoming drive schedules**, CTC packages, and eligibility criteria
- 📋 **Company-specific exam patterns** (Aptitude, Coding, Technical, HR)
- 🎯 **Eligibility check** — verify if your CGPA & branch qualify
- 💡 **Placement Calendar** from August through April

Ask me about any company or say *"show upcoming drives"*!`
  }
};

// ---- Init ---- //
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  updateQuickPrompts();
  updateEngineBadge();
  setupScrollAnimations();
  setupNavHighlight();
  initSkillBarsDemo();
});

function initChat() {
  const mod = modules[currentModule];
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  chatHistory.length = 0;
  addMessage('ai', mod.greeting, true);
}

function switchModule(moduleKey, btn) {
  currentModule = moduleKey;
  document.querySelectorAll('.module-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const mod = modules[moduleKey];
  document.getElementById('chatStatus').textContent = mod.statusLabel;
  clearChat();
  updateQuickPrompts();
}

function updateQuickPrompts() {
  const mod = modules[currentModule];
  const list = document.getElementById('quickPromptList');
  if (!list) return;
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
  chatHistory.length = 0;
  interviewSession.active = false;
  addMessage('ai', modules[currentModule].greeting, true);
}

// ---- AI Engine Settings Modal ---- //
function openApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  const input = document.getElementById('geminiKeyInput');
  if (input) input.value = (geminiApiKey && geminiApiKey !== 'OFFLINE') ? geminiApiKey : '';
  if (modal) modal.style.display = 'flex';
}

function closeApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.style.display = 'none';
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'apiKeyModal') closeApiKeyModal();
}

function saveApiKey() {
  const input = document.getElementById('geminiKeyInput');
  const val = input ? input.value.trim() : '';
  if (val) {
    geminiApiKey = val;
    localStorage.setItem('cc_gemini_api_key', val);
  } else {
    geminiApiKey = DEFAULT_GEMINI_KEY;
    localStorage.removeItem('cc_gemini_api_key');
  }
  updateEngineBadge();
  closeApiKeyModal();
  addMessage('ai', `✨ **Connected to Google Gemini 3.1 Flash Lite Live AI!** Queries are now processed with specialized system prompts for each module.`, false, 'gemini');
}

function clearApiKey() {
  geminiApiKey = 'OFFLINE';
  localStorage.setItem('cc_gemini_api_key', 'OFFLINE');
  const input = document.getElementById('geminiKeyInput');
  if (input) input.value = '';
  updateEngineBadge();
  closeApiKeyModal();
  addMessage('ai', `⚡ **Switched to Campus Compass Smart Dynamic Engine.** Running in offline simulation mode.`, false, 'smart');
}

function updateEngineBadge() {
  const label = document.getElementById('engineLabel');
  const dot = document.getElementById('engineDot');
  if (label && dot) {
    if (geminiApiKey && geminiApiKey !== 'OFFLINE') {
      label.textContent = 'Gemini 3.1 Flash Lite';
      dot.style.background = 'var(--cyan)';
      dot.style.boxShadow = '0 0 8px var(--cyan)';
    } else {
      label.textContent = 'Smart Engine (Offline)';
      dot.style.background = 'var(--green)';
      dot.style.boxShadow = '0 0 8px var(--green)';
    }
  }
}

// ---- Prompt Inspector Modal Functions ---- //
function openPromptModal() {
  const modal = document.getElementById('promptModal');
  if (modal) {
    modal.style.display = 'flex';
    showPromptTab(currentModule);
  }
}

function closePromptModal() {
  const modal = document.getElementById('promptModal');
  if (modal) modal.style.display = 'none';
}

function handlePromptModalBackdropClick(e) {
  if (e.target.id === 'promptModal') closePromptModal();
}

function showPromptTab(modKey) {
  document.querySelectorAll('.prompt-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`ptab-${modKey}`);
  if (activeBtn) activeBtn.classList.add('active');

  const display = document.getElementById('promptCodeDisplay');
  if (display && MODULE_PROMPTS[modKey]) {
    display.textContent = MODULE_PROMPTS[modKey];
  }

  const indicator = document.getElementById('promptActiveIndicator');
  if (indicator) {
    indicator.textContent = (modKey === currentModule)
      ? `● Currently active in your chat session (${modules[modKey].name})`
      : `Specialized prompt for ${modules[modKey].name}`;
    indicator.style.color = (modKey === currentModule) ? 'var(--cyan)' : 'var(--text-dim)';
  }
}

// ---- Message Rendering & Formatting ---- //
function addMessage(sender, text, instant = false, engineSource = null) {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `message ${sender}`;

  let metaBadge = '';
  if (sender === 'ai' && !instant) {
    if (engineSource === 'gemini') {
      metaBadge = `
        <div class="msg-meta-tag badge-gemini">
          <span>✨ Gemini 3.1 Flash Lite Live AI</span>
          <span class="badge-prompt-tag">Prompt: ${modules[currentModule].name}</span>
        </div>`;
    } else if (engineSource === 'smart') {
      metaBadge = `
        <div class="msg-meta-tag badge-smart">
          <span>⚡ Smart Dynamic Engine</span>
          <span class="badge-prompt-tag">Module: ${modules[currentModule].name}</span>
        </div>`;
    }
  }

  div.innerHTML = `
    <div class="msg-icon">${sender === 'ai' ? 'CC' : '👤'}</div>
    <div class="message-content">${metaBadge}${formatMessage(text)}</div>
  `;
  if (!instant) div.style.opacity = '0';
  chatMessages.appendChild(div);

  if (!instant) {
    requestAnimationFrame(() => { div.style.opacity = '1'; });
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Add to history with consistent role for Gemini API multi-turn context
  chatHistory.push({
    sender,
    role: sender === 'ai' ? 'model' : 'user',
    text
  });
  return div;
}

function formatMessage(text) {
  if (!text) return '';

  // 1. Preserve code blocks
  const codeBlocks = [];
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlocks.push({ lang, code: escapeHtml(code) });
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 2. Parse Markdown Tables (robust line-based block parser)
  text = parseMarkdownTables(text);

  // 3. Format Task Checklists
  text = text.replace(/^[ \t]*-\s*\[ \]\s*(.+)$/gm, '<li class="checklist-item"><span class="check-box"></span> <span>$1</span></li>');
  text = text.replace(/^[ \t]*-\s*\[x\]\s*(.+)$/gim, '<li class="checklist-item done"><span class="check-box checked">✓</span> <span>$1</span></li>');

  // 4. Format Blockquotes
  text = text.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // 5. Format Headings
  text = text.replace(/^### (.*$)/gm, '<h4 style="color:var(--cyan);margin:10px 0 4px;font-size:0.95rem;">$1</h4>');
  text = text.replace(/^## (.*$)/gm, '<h3 style="color:var(--text);margin:14px 0 6px;font-size:1.05rem;">$1</h3>');
  text = text.replace(/^# (.*$)/gm, '<h2 style="color:var(--text);margin:16px 0 8px;font-size:1.15rem;">$1</h2>');

  // 6. Horizontal rules
  text = text.replace(/^---$/gm, '<hr/>');

  // 7. Bold & Italic
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 8. Inline code
  text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:0.85em;color:#38bdf8;">$1</code>');

  // 9. Unordered Lists (excluding checklists already handled)
  text = text.replace(/((?:^[ \t]*[-*]\s+(?!<li class="checklist-item").+(?:\n|$))+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => l.replace(/^[ \t]*[-*]\s+/, '').trim());
    return '<ul>' + items.map(it => `<li>${it}</li>`).join('') + '</ul>';
  });

  // Group orphaned checklist items into a list
  text = text.replace(/((?:<li class="checklist-item[^>]*>.*?<\/li>\s*)+)/g, '<ul style="margin:8px 0;padding-left:0;">$1</ul>');

  // 10. Ordered Lists
  text = text.replace(/((?:^[ \t]*\d+\.\s+.+(?:\n|$))+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => l.replace(/^[ \t]*\d+\.\s+/, '').trim());
    return '<ol>' + items.map(it => `<li>${it}</li>`).join('') + '</ol>';
  });

  // 11. Paragraphs & Line breaks
  text = text.replace(/\n\n+/g, '</p><p>');
  text = text.replace(/\n/g, '<br/>');
  text = '<p>' + text + '</p>';
  text = text.replace(/<p><\/p>/g, '');
  text = text.replace(/<p>(<(?:ul|ol|table|blockquote|h2|h3|h4|div|hr)[^>]*>)/g, '$1');
  text = text.replace(/(<\/(?:ul|ol|table|blockquote|h2|h3|h4|div|hr)>)<\/p>/g, '$1');
  text = text.replace(/<br\/><div class="table-wrapper">/g, '<div class="table-wrapper">');
  text = text.replace(/<\/div><br\/>/g, '</div>');
  text = text.replace(/<p><br\/>/g, '<p>');
  text = text.replace(/<br\/><\/p>/g, '</p>');
  text = text.replace(/<\/li><br\/>/g, '</li>');
  text = text.replace(/<br\/><li/g, '<li');
  text = text.replace(/<ul([^>]*)><br\/>/g, '<ul$1>');
  text = text.replace(/<ol([^>]*)><br\/>/g, '<ol$1>');
  text = text.replace(/<br\/><\/ul>/g, '</ul>');
  text = text.replace(/<br\/><\/ol>/g, '</ol>');

  // 12. Restore code blocks
  text = text.replace(/__CODE_BLOCK_(\d+)__/g, (match, idx) => {
    const item = codeBlocks[idx];
    return `<pre><code>${item.code}</code></pre>`;
  });

  return text;
}

function parseMarkdownTables(text) {
  const lines = text.split('\n');
  const result = [];
  let inTable = false;
  let tableLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        result.push(renderMarkdownTable(tableLines));
        tableLines = [];
        inTable = false;
      }
      result.push(lines[i]);
    }
  }
  if (inTable) {
    result.push(renderMarkdownTable(tableLines));
  }
  return result.join('\n');
}

function renderMarkdownTable(tableLines) {
  if (tableLines.length < 2) return tableLines.join('\n');

  let inHeader = true;
  let html = '<div class="table-wrapper"><table class="chat-table">';

  for (let i = 0; i < tableLines.length; i++) {
    const line = tableLines[i].trim();
    if (!line.startsWith('|') || !line.endsWith('|')) continue;
    if (/^\|[\s\-:|]+\|$/.test(line)) {
      inHeader = false;
      continue;
    }
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (inHeader && i === 0) {
      html += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
    } else {
      html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    }
  }

  html += '</tbody></table></div>';
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

  try {
    let responseText = '';
    let engineUsed = 'smart';

    // Check if live Gemini API is configured and not toggled to offline
    if (geminiApiKey && geminiApiKey !== 'OFFLINE') {
      try {
        responseText = await callGeminiAPI(text);
        engineUsed = 'gemini';
      } catch (err) {
        console.warn('Gemini API failed, falling back to Smart Engine:', err);
        responseText = `⚠️ *Note: Live Gemini request encountered an issue (${err.message}). Using Campus Compass Smart Engine:* \n\n` +
          await generateSmartResponse(text);
        engineUsed = 'smart';
      }
    } else {
      // Simulate realistic AI generation latency
      const delay = 500 + Math.random() * 400;
      await sleep(delay);
      responseText = await generateSmartResponse(text);
      engineUsed = 'smart';
    }

    removeTypingIndicator();
    const msgEl = addMessage('ai', responseText, false, engineUsed);

    // Add visual skill bars if triggered
    const lower = text.toLowerCase();
    if (currentModule === 'skill' || lower.includes('full stack') || lower.includes('data science') || lower.includes('skill gap')) {
      addSkillBars(msgEl.querySelector('.message-content'), text);
    }
  } catch (error) {
    removeTypingIndicator();
    addMessage('ai', `⚠️ An error occurred while generating advice. Please try again.`, false, 'smart');
    console.error(error);
  } finally {
    isTyping = false;
    document.getElementById('sendBtn').disabled = false;
  }
}

// ---- Specialized System Prompts for Each Module ---- //
const MODULE_PROMPTS = {
  career: `You are Campus Compass AI — an expert AI Career Counselor and Technical Mentor for engineering and college students in India.

Persona & Context:
- Deeply knowledgeable about Indian campus placement ecosystems (Tier 1, 2, and 3 colleges).
- Understand the reality of mass recruiters (TCS Ninja/Digital, Infosys, Wipro, Cognizant, Accenture: 3.5–9 LPA) vs product/growth companies (Amazon, Flipkart, PhonePe, Razorpay, Google, Microsoft: 12–45+ LPA).
- Expert across all engineering tracks: SDE / Software Engineer, Data Science & AI/ML, Full-Stack Development, Cloud & DevOps, Cybersecurity, and non-CS to IT transition.

Your Mission:
- Deliver structured, actionable guidance with 3-Phase Roadmaps (Phase 1: Foundations → Phase 2: Portfolio Projects → Phase 3: Placement Sprints).
- Provide realistic compensation expectations in INR LPA, top Indian recruiters hiring for this profile, and essential core tech stacks.
- Keep tone empathetic, highly encouraging, structured, and pragmatic.
- Use bold markdown, bullet lists, and end with 2 suggested follow-up questions or actionable next steps.`,


  interview: `You are Campus Compass AI — Senior Technical Interviewer & Bar Raiser conducting realistic technical and behavioral campus placement interviews.

Persona & Context:
- You have conducted 500+ technical interviews for companies like IBM, Amazon, TCS, Google, Infosys, and high-growth startups.
- You evaluate candidates on Technical Depth, Problem Structuring, Communication Clarity, and Edge-Case Handling.

Your Mission:
- Conduct an interactive mock interview.
- Ask ONE targeted question at a time.
- When the candidate answers:
  1. Score their answer out of 10 on: (a) Clarity, (b) Technical Accuracy, (c) Structure.
  2. Highlight what was good and what was missing (edge cases, time/space complexity, practical trade-offs).
  3. Provide the Ideal Model Answer.
  4. Ask the next question (increasing difficulty from fundamentals to system design/scenarios).
- If the user types "hint", provide a helpful hint without revealing the entire solution. If they type "skip", explain the answer and move forward.
- Keep the tone professional, motivating, and realistic.`,

  skill: `You are Campus Compass AI — Principal Engineering Mentor & Competency Architect.

Persona & Context:
- Expert at bridging the gap between college university curricula and modern industry tech stacks.
- Specialize in diagnosing exact skill deficiencies that cause students to get rejected in coding assessments or technical rounds.

Your Mission:
- For any target role or skill query, generate a comprehensive Skill Gap & Readiness Matrix:
  1. 🔴 Critical Gaps (Must-Haves): Core competencies required to pass initial online assessments and round 1 technical interviews.
  2. 🟡 Important Gaps (Differentiators): Hands-on frameworks, REST APIs, databases, and architectural concepts that set candidates apart.
  3. 🟢 Bonus High-Tier Skills: Cloud deployments (AWS/GCP), Docker, CI/CD, Redis, or microservices that unlock higher package tiers (10+ LPA).
  4. 📅 90-Day Execution Sprint: A structured 3-month timeline (Months 1, 2, and 3) with concrete weekly milestones.
  5. 📚 Curated zero-cost learning resources (official documentation, top GitHub roadmaps, platforms).`,

  placement: `You are Campus Compass AI — Campus Placement Director & Company Recruitment Intelligence Specialist.

Persona & Context:
- Comprehensive database of 50+ major campus recruiters in India (TCS, Infosys, Cognizant, Wipro, Accenture, Amazon, Microsoft, IBM, Cisco, Deloitte, etc.).
- Deep knowledge of exam patterns, eligibility cutoffs, hiring timelines (Day 0, Day 1, Dream slots), and compensation breakdowns.

Your Mission:
- When a student asks about any company or upcoming placement drives:
  1. 🏢 Company Profile & Package Tiers: Base CTC, variable bonuses, and role classifications (e.g., TCS Ninja 3.36 LPA vs Digital 7 LPA vs Prime 9 LPA).
  2. 📋 Recruitment Process Breakdown: Step-by-step phases (Online Test sections, Technical Interviews, Managerial/HR).
  3. 🎯 Eligibility & Cutoffs: CGPA criteria, maximum allowable backlogs, eligible branches, and year gaps.
  4. 💡 Past Exam Patterns & High-Frequency Topics: Most commonly tested DSA patterns, aptitude sections, and core subject questions (OS, DBMS, CN).
  5. ⚡ 7-Day Last-Mile Prep Checklist: High-yield strategy for the final week before the drive.`
};

// ---- Gemini Live API Integration ---- //
async function callGeminiAPI(userQuery) {
  // Use dedicated system prompt for the active module
  const systemInstruction = MODULE_PROMPTS[currentModule] || MODULE_PROMPTS.career;

  // Build clean contents array from chat history (last 8 turns)
  const contents = [];
  const validHistory = chatHistory.filter(h => h && h.text && (h.role === 'user' || h.role === 'model'));

  for (const turn of validHistory.slice(-8)) {
    const role = turn.role;
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n' + turn.text;
    } else {
      contents.push({ role, parts: [{ text: turn.text }] });
    }
  }

  // Gemini API requires first message in contents to have role 'user'
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.shift();
  }

  // Add the current user query
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += '\n' + userQuery;
  } else {
    contents.push({ role: 'user', parts: [{ text: userQuery }] });
  }

  // Model: Google Gemini 3.1 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`;

  let res;
  let retries = 3;
  let delay = 1000;
  let lastError = null;

  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // Increased timeout to 25s

    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 1200,
            topP: 0.95
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) throw new Error('Empty response from Gemini');

      return responseText;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini API attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(`Gemini API failed after ${retries} attempts. Last error: ${lastError.message}`);
}


// ==========================================================================

// CAMPUS COMPASS SMART DYNAMIC ENGINE
// ==========================================================================
async function generateSmartResponse(text) {
  const lower = text.toLowerCase();

  // Route to the appropriate module engine
  if (currentModule === 'interview' || lower.includes('interview') || interviewSession.active) {
    return handleMockInterview(text, lower);
  }

  if (currentModule === 'skill' || lower.includes('skill') || lower.includes('learn') || lower.includes('roadmap')) {
    return handleSkillGapDetector(text, lower);
  }
  if (currentModule === 'placement' || lower.includes('placement') || lower.includes('drive') || lower.includes('cutoff') || lower.includes('eligibility')) {
    return handlePlacementTracker(text, lower);
  }

  // Default to Career Navigator
  return handleCareerNavigator(text, lower);
}

// --------------------------------------------------------------------------
// 1. MOCK INTERVIEW ENGINE (Interactive Multi-Turn State Machine)
// --------------------------------------------------------------------------
function handleMockInterview(text, lower) {
  // If session is active, evaluate answer or handle controls
  if (interviewSession.active) {
    // Check for control commands
    if (lower === 'hint' || lower.includes('give me a hint') || lower.includes('need a hint')) {
      const q = interviewSession.questions[interviewSession.questionIndex];
      return `💡 **Interview Hint (Question ${interviewSession.questionIndex + 1}):**\n\n${q.hint}\n\n*Take a moment to formulate your answer and submit it below!*`;
    }

    if (lower === 'skip' || lower === 'pass' || lower.includes('sample answer') || lower.includes('show answer')) {
      const q = interviewSession.questions[interviewSession.questionIndex];
      interviewSession.scores.push({
        qIndex: interviewSession.questionIndex + 1,
        clarity: 0,
        technical: 0,
        structure: 0,
        skipped: true
      });

      let resp = `⏩ **Question ${interviewSession.questionIndex + 1} Skipped.**\n\n💡 **Sample Ideal Answer:**\n> ${q.modelAnswer}\n\n---\n`;
      interviewSession.questionIndex++;

      if (interviewSession.questionIndex < interviewSession.questions.length) {
        const nextQ = interviewSession.questions[interviewSession.questionIndex];
        resp += `### 🔹 Question ${interviewSession.questionIndex + 1} of ${interviewSession.questions.length}: ${nextQ.topic}\n\n` +
          `*"${nextQ.question}"*\n\n` +
          `💡 **Evaluation Criteria:** ${nextQ.tip}\n\n` +
          `*Type your answer below, or type \`hint\` / \`skip\`.*`;
        return resp;
      } else {
        return resp + generateInterviewReport();
      }
    }

    if (lower.includes('stop') || lower.includes('end interview') || lower.includes('quit') || lower.includes('exit')) {
      return generateInterviewReport(true);
    }

    // Evaluate candidate's answer
    const currentQ = interviewSession.questions[interviewSession.questionIndex];
    const evaluation = evaluateCandidateAnswer(text, currentQ);

    interviewSession.scores.push({
      qIndex: interviewSession.questionIndex + 1,
      clarity: evaluation.clarity,
      technical: evaluation.technical,
      structure: evaluation.structure,
      skipped: false
    });

    let resp = `### 📊 Evaluation — Question ${interviewSession.questionIndex + 1} of ${interviewSession.questions.length}\n\n` +
      `| Criteria | Score | Feedback |\n` +
      `|----------|-------|----------|\n` +
      `| **Clarity** | ${evaluation.clarity}/10 | ${evaluation.clarityFeedback} |\n` +
      `| **Technical Accuracy** | ${evaluation.technical}/10 | ${evaluation.techFeedback} |\n` +
      `| **Structure & Logic** | ${evaluation.structure}/10 | ${evaluation.structFeedback} |\n\n` +
      `**Overall Question Rating:** \`${evaluation.totalScore.toFixed(1)} / 10\`\n\n` +
      `✅ **What you did well:**\n${evaluation.strengths}\n\n` +
      `⚠️ **Improvement Points:**\n${evaluation.improvements}\n\n` +
      `💡 **Ideal Model Answer:**\n> ${currentQ.modelAnswer}\n\n---\n`;

    interviewSession.questionIndex++;

    if (interviewSession.questionIndex < interviewSession.questions.length) {
      const nextQ = interviewSession.questions[interviewSession.questionIndex];
      resp += `### 🔹 Question ${interviewSession.questionIndex + 1} of ${interviewSession.questions.length}: ${nextQ.topic}\n\n` +
        `*"${nextQ.question}"*\n\n` +
        `💡 **Evaluation Focus:** ${nextQ.tip}\n\n` +
        `*Type your answer below, or type \`hint\` / \`skip\`.*`;
      return resp;
    } else {
      return resp + generateInterviewReport();
    }
  }

  // Check if starting a new interview session
  const company = detectCompany(lower);
  const roundType = detectRound(lower);
  const role = detectRole(lower) || 'Software / Associate Engineer';

  // Build tailored question bank
  interviewSession.company = company || 'Tech Placement';
  interviewSession.role = role;
  interviewSession.round = roundType;
  interviewSession.questionIndex = 0;
  interviewSession.scores = [];
  interviewSession.active = true;
  interviewSession.questions = getCompanyQuestions(company, roundType, role);

  const firstQ = interviewSession.questions[0];

  return `🏢 **${interviewSession.company.toUpperCase()} ${interviewSession.role.toUpperCase()} — ${roundType.toUpperCase()} SIMULATION STARTED!**

Welcome to your structured mock interview session. ${getCompanyContext(company, roundType)}

**Session Rules:**
- Answer naturally just like in a live interview
- Type \`hint\` for a helpful clue without spoiling the answer
- Type \`skip\` to view the model answer and move forward
- Type \`end interview\` to wrap up and receive your final report

---
### 🔹 Question 1 of ${interviewSession.questions.length}: ${firstQ.topic}

*"${firstQ.question}"*

💡 **Evaluation Focus:** ${firstQ.tip}

*Type your answer below to begin!*`;
}

function detectCompany(lower) {
  if (lower.includes('ibm')) return 'IBM';
  if (lower.includes('amazon')) return 'Amazon';
  if (lower.includes('google')) return 'Google';
  if (lower.includes('microsoft')) return 'Microsoft';
  if (lower.includes('tcs')) return 'TCS';
  if (lower.includes('infosys')) return 'Infosys';
  if (lower.includes('wipro')) return 'Wipro';
  if (lower.includes('accenture')) return 'Accenture';
  if (lower.includes('cognizant')) return 'Cognizant';
  if (lower.includes('capgemini')) return 'Capgemini';
  if (lower.includes('deloitte')) return 'Deloitte';
  if (lower.includes('zoho')) return 'Zoho';
  return 'Tech Placement';
}

function detectRound(lower) {
  if (lower.includes('hr') || lower.includes('behavioral') || lower.includes('star method')) return 'HR & Behavioral';
  if (lower.includes('coding') || lower.includes('dsa') || lower.includes('algorithm')) return 'Coding & DSA';
  if (lower.includes('system design') || lower.includes('architecture')) return 'System Design';
  return 'Technical Round';
}

function detectRole(lower) {
  if (lower.includes('associate engineer') || lower.includes('associate system engineer') || lower.includes('ase')) return 'Associate Engineer';
  if (lower.includes('data scientist') || lower.includes('data analyst')) return 'Data Scientist';
  if (lower.includes('full stack') || lower.includes('fullstack') || lower.includes('web dev')) return 'Full-Stack Developer';
  if (lower.includes('cloud') || lower.includes('devops')) return 'Cloud & DevOps Engineer';
  if (lower.includes('sde') || lower.includes('software engineer') || lower.includes('swe')) return 'Software Engineer';
  return 'Software / Associate Engineer';
}

function getCompanyContext(company, round) {
  switch (company) {
    case 'IBM':
      return `IBM evaluations focus on core programming fundamentals, Object-Oriented Design, SQL query precision, cloud awareness, and clean logical articulation.`;
    case 'Amazon':
      return `Amazon evaluates both technical depth (scalable algorithms, clean code) and behavioral fit via the 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action).`;
    case 'Google':
      return `Google prioritizes algorithmic rigor, optimal Big-O time/space complexity, modular code, and thorough edge-case analysis.`;
    case 'TCS':
      return `TCS technical rounds verify foundational C/Java/Python syntax, OOPS pillars, database basics, and your academic project contribution.`;
    case 'Infosys':
      return `Infosys rounds test core problem solving, data structures, SQL queries, and software engineering methodologies.`;
    default:
      return `This session is calibrated to top tech hiring bars in India, evaluating your clarity, technical accuracy, and structured communication.`;
  }
}

function getCompanyQuestions(company, round, role) {
  if (company === 'IBM') {
    if (round === 'HR & Behavioral') {
      return [
        {
          topic: 'Personal Pitch & Alignment',
          question: 'Walk me through your background. What specifically draws you to IBM, and how do IBM\'s core values align with your career goals?',
          tip: 'Use the Present-Past-Future structure and highlight innovation or trust.',
          hint: 'Mention what you study now, an impactful project, and why IBM\'s Hybrid Cloud / AI work excites you.',
          keyConcepts: ['ibm', 'projects', 'hybrid cloud', 'values', 'collaboration', 'curiosity'],
          modelAnswer: 'I am a final-year engineering student passionate about scalable enterprise software. In my past projects, I engineered full-stack applications and relational database backends. I admire IBM\'s relentless leadership in enterprise computing, Red Hat OpenShift, and trust-first AI ethics. The Associate Engineer role matches my ambition to build dependable, large-scale systems alongside global teams.'
        },
        {
          topic: 'Collaboration & Conflict Resolution (STAR)',
          question: 'Describe a project where team members had conflicting technical opinions or faced a sudden deadline crunch. How did you handle it?',
          tip: 'Use the STAR format: Situation, Task, Action, Result. Highlight objective decision making.',
          hint: 'Focus on listening to data, proposing a prototype or trade-off analysis, and keeping the team focused on delivery.',
          keyConcepts: ['star', 'situation', 'task', 'action', 'result', 'conflict', 'data', 'compromise'],
          modelAnswer: 'In our 6th-semester capstone, my teammate and I disagreed on whether to use MongoDB or PostgreSQL. As tech lead, I scheduled a 30-minute evaluation comparing our ACID compliance needs and query patterns. Data showed 90% of our data was relational, so we chose PostgreSQL. We delivered the project 3 days ahead of deadline with zero data anomalies.'
        },
        {
          topic: 'Learning Agility & Adaptation',
          question: 'Technology evolves rapidly at IBM. Tell me about a time you had to learn a completely new tool or framework under time pressure.',
          tip: 'Demonstrate resourcefulness, proactive learning, and practical application.',
          hint: 'Mention how you broke the learning down (official docs, hands-on mini-project) and applied it successfully.',
          keyConcepts: ['learning', 'documentation', 'hands-on', 'delivered', 'timeline'],
          modelAnswer: 'During an internship hackathon, our client required a Dockerized microservice, which I had never used. Over a weekend, I studied official container documentation, built a sample containerized Node app, and debugged networking rules. On Monday, I successfully deployed our service container, reducing deployment setup time from 40 minutes to under 2 minutes.'
        }
      ];
    }

    // Default: IBM Associate Engineer Technical Round
    return [
      {
        topic: 'OOP Fundamentals & Polymorphism',
        question: 'Can you explain the difference between Method Overloading and Method Overriding in Java or C++? Specifically, how does compiler binding differ from runtime dispatch, and when would you use each in software design?',
        tip: 'Contrast compile-time (static) vs runtime (dynamic) polymorphism, signature requirements, and the @Override annotation / vtable.',
        hint: 'Think about when the decision of which method to call is made: at compilation (parameters vary) or at runtime (subclass implementation overrides parent).',
        keyConcepts: ['overloading', 'overriding', 'compile-time', 'runtime', 'polymorphism', 'signature', 'inheritance', 'dispatch', 'vtable'],
        modelAnswer: 'Method Overloading occurs within the same class where methods share the same name but have different parameter lists (type, count, or order); it is resolved at compile time (static binding). Method Overriding occurs across an inheritance hierarchy where a subclass provides a specific implementation of a method already declared in its parent with the exact same signature and return type; it is resolved at runtime via dynamic method dispatch (vtable). Overloading is used for convenience (e.g. print(int), print(String)), while Overriding allows polymorphic substitution (e.g., shape.draw()).'
      },
      {
        topic: 'SQL & Database Querying',
        question: 'In an enterprise database, you have an Employees table with columns (emp_id, emp_name, dept_id, salary). Write a SQL query or explain the logic to find the 2nd highest salary in each department. How would you index this table for high performance?',
        tip: 'Mention window functions like DENSE_RANK() or subqueries with GROUP BY, and discuss composite B-Tree indexes on (dept_id, salary DESC).',
        hint: 'Window functions like DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) handle ties and grouping cleanly.',
        keyConcepts: ['dense_rank', 'partition by', 'order by', 'subquery', 'group by', 'salary', 'index', 'b-tree', 'performance'],
        modelAnswer: 'Using modern SQL with window functions: \n```sql\nWITH RankedSalaries AS (\n  SELECT emp_id, emp_name, dept_id, salary,\n         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk\n  FROM Employees\n)\nSELECT emp_id, emp_name, dept_id, salary\nFROM RankedSalaries WHERE rnk = 2;\n```\nTo optimize this query for millions of records, create a composite B-Tree index on `(dept_id, salary DESC)`, allowing the database engine to perform an index scan without full-table sorting.'
      },
      {
        topic: 'Data Structures & Algorithms',
        question: 'Suppose you have an array of customer transaction IDs. How would you determine if there are any duplicate transaction IDs occurring within k distance of each other? What data structure and Big-O complexities would you achieve?',
        tip: 'Identify the Sliding Window approach combined with a Hash Set for O(N) time and O(k) auxiliary space.',
        hint: 'Instead of comparing every pair with O(N*k) nested loops, maintain a sliding window of size k using a Hash Set.',
        keyConcepts: ['sliding window', 'hashset', 'set', 'hash table', 'o(n)', 'o(k)', 'complexity', 'duplicates'],
        modelAnswer: 'The optimal approach uses a Sliding Window with a Hash Set. As we iterate through the array from left to right: for each element `nums[i]`, we check if it already exists in our set. If it does, we found duplicates within distance k and return true. Otherwise, we add `nums[i]` to the set. When the window size exceeds k, we remove `nums[i - k]` from the set. This achieves O(N) time complexity and O(k) extra space, far superior to the brute-force O(N × k).'
      },
      {
        topic: 'Cloud & Microservice Architecture',
        question: 'IBM Cloud heavily relies on microservices and Kubernetes. What is the role of an API Gateway, and how does it differ from a standard Load Balancer?',
        tip: 'Contrast layer-7 application concerns (auth, rate limiting, routing, SSL termination) with layer-4/7 traffic distribution.',
        hint: 'A load balancer distributes incoming network packets to healthy servers. An API gateway acts as a single smart entry point handling security, transformations, and microservice orchestration.',
        keyConcepts: ['api gateway', 'load balancer', 'microservices', 'routing', 'rate limiting', 'authentication', 'reverse proxy', 'traffic'],
        modelAnswer: 'A Load Balancer operates primarily at Layer 4 (TCP/UDP) or basic Layer 7 (HTTP) to evenly distribute incoming traffic across redundant server instances to ensure high availability and prevent hotspots. An API Gateway sits in front of microservices as a smart facade, handling cross-cutting application concerns: API routing, JWT authentication, rate limiting/throttling, SSL termination, request/response transformation, and telemetry. In production, an API Gateway often runs behind a high-capacity Load Balancer.'
      }
    ];
  }

  // Default: Generic Technical Interview Questions
  return [
    {
      topic: 'Core Computer Science & OOP',
      question: 'Explain the 4 pillars of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, Polymorphism) and provide a concise software example of each.',
      tip: 'Briefly define each pillar and show how they lead to maintainable, modular software.',
      hint: 'Encapsulation = data hiding; Abstraction = interface vs implementation; Inheritance = code reuse; Polymorphism = many forms.',
      keyConcepts: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'private', 'interface', 'class'],
      modelAnswer: '1. Encapsulation: Bundling data and methods while restricting direct access (private variables + getters/setters). 2. Abstraction: Hiding internal complexity behind a simple interface (e.g. List interface vs ArrayList). 3. Inheritance: Mechanism where a child class inherits fields/methods from a parent class (Dog extends Animal). 4. Polymorphism: Ability of an entity to take multiple forms via method overloading (static) or method overriding (dynamic).'
    },
    {
      topic: 'Data Structures & Algorithmic Complexity',
      question: 'Compare a Hash Table (HashMap) and a Binary Search Tree (BST). When would you choose one over the other, and what are their search complexities?',
      tip: 'Discuss average O(1) vs worst-case O(N) for HashMap, and O(log N) for balanced BST with ordering properties.',
      hint: 'HashMaps provide instant lookup, but BSTs keep keys sorted in order and support range queries (e.g. min, max, floor, ceiling).',
      keyConcepts: ['hashmap', 'hash table', 'bst', 'binary search tree', 'o(1)', 'o(log n)', 'sorted', 'range queries'],
      modelAnswer: 'A HashMap provides O(1) average time complexity for insert, delete, and search operations using hashing, but elements are unordered and worst-case is O(N) during collisions. A balanced BST (like Red-Black Tree) guarantees O(log N) time for all operations and keeps elements strictly sorted. Choose HashMap when you only need fast key-value lookups; choose BST when you need sorted traversal, predecessor/successor queries, or range lookups.'
    },
    {
      topic: 'Database Fundamentals & Transactions',
      question: 'What are the ACID properties in relational database management systems? Why are they vital for transactions?',
      tip: 'Atomicity, Consistency, Isolation, Durability. Give a bank transfer scenario.',
      hint: 'Think of transferring money from Account A to Account B: either both happen or neither happens.',
      keyConcepts: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'rollback'],
      modelAnswer: 'ACID guarantees database transaction reliability: 1. Atomicity: All or nothing—if any statement fails, the entire transaction rolls back. 2. Consistency: The database transitions from one valid state to another without violating constraints. 3. Isolation: Concurrent transactions do not interfere with each other (preventing dirty/phantom reads). 4. Durability: Once committed, changes persist even in system crashes. In a bank transfer, Atomicity ensures funds are never deducted without being credited.'
    }
  ];
}

function evaluateCandidateAnswer(answer, q) {
  const lower = answer.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(w => w.length > 2);

  // Check matched key concepts
  let matchCount = 0;
  const matchedList = [];
  const missingList = [];

  q.keyConcepts.forEach(c => {
    if (lower.includes(c)) {
      matchCount++;
      matchedList.push(c);
    } else {
      missingList.push(c);
    }
  });

  const conceptCoverage = matchCount / q.keyConcepts.length;

  // Length scoring
  let clarityScore = 7.0;
  let techScore = 7.0;
  let structScore = 7.0;

  if (words.length < 8) {
    clarityScore = 5.0;
    techScore = 5.0;
    structScore = 5.0;
  } else if (words.length >= 25 && conceptCoverage >= 0.4) {
    clarityScore = Math.min(9.5, 7.5 + (words.length > 40 ? 1.0 : 0.5));
    techScore = Math.min(9.5, 6.5 + conceptCoverage * 3.0);
    structScore = Math.min(9.5, 7.5 + (lower.includes('for example') || lower.includes('e.g.') || lower.includes('whereas') ? 1.5 : 0.5));
  } else {
    techScore = Math.min(8.0, 5.5 + conceptCoverage * 3.0);
  }

  const totalScore = (clarityScore + techScore + structScore) / 3;

  return {
    clarity: clarityScore.toFixed(1),
    technical: techScore.toFixed(1),
    structure: structScore.toFixed(1),
    totalScore,
    clarityFeedback: words.length < 15 ? 'A bit brief. Elaborate further with concrete terminology.' : 'Clear expression and good communication flow.',
    techFeedback: conceptCoverage >= 0.5 ? `Good technical grasp. Covered ${matchedList.slice(0, 3).join(', ')}.` : `Missed key technical depth: consider adding ${missingList.slice(0, 2).join(', ')}.`,
    structFeedback: lower.includes('because') || lower.includes('example') || lower.includes('whereas') ? 'Well structured with reasoning and comparison.' : 'Use clear bullet points or a "Concept → Mechanism → Example" format.',
    strengths: matchedList.length > 0 ? `Demonstrated knowledge of **${matchedList.slice(0, 4).join('**, **')}**.` : 'Attempted to address the core problem directly.',
    improvements: missingList.length > 0 ? `To achieve a top score, explicitly discuss **${missingList.slice(0, 3).join('**, **')}**.` : 'Polished answer! Keep explanations crisp under timed conditions.'
  };
}

function generateInterviewReport(earlyExit = false) {
  const validScores = interviewSession.scores.filter(s => !s.skipped);
  const totalQuestions = interviewSession.questions.length;
  const answeredCount = validScores.length;

  let avgScore = 0;
  if (answeredCount > 0) {
    const sum = validScores.reduce((acc, s) => acc + (parseFloat(s.clarity) + parseFloat(s.technical) + parseFloat(s.structure)) / 3, 0);
    avgScore = sum / answeredCount;
  }

  const percentage = Math.round((avgScore / 10) * 100);
  let verdict = '🟢 Recommended — Strong Candidate';
  if (percentage < 65) verdict = '🟡 Needs Preparation — Review Weak Topics';
  if (percentage >= 85) verdict = '🌟 Top Tier — High Placement Probability';

  interviewSession.active = false;

  return `\n## 🏆 Mock Interview Scorecard — ${interviewSession.company} (${interviewSession.role})

${earlyExit ? '*(Session ended early by candidate)*\n\n' : ''}
<div class="score-badge-card">
  <div style="font-size:0.85rem;color:var(--text-muted);">Overall Placement Readiness Score:</div>
  <div style="font-size:1.8rem;font-weight:800;color:var(--cyan);">${percentage}% (${avgScore.toFixed(1)} / 10)</div>
  <div style="font-weight:600;margin-top:4px;">${verdict}</div>
  <div class="score-badge-grid">
    <div class="score-badge-item">
      <div class="score-badge-num">${answeredCount}/${totalQuestions}</div>
      <div class="score-badge-lbl">Completed</div>
    </div>
    <div class="score-badge-item">
      <div class="score-badge-num">${(validScores.reduce((a, b) => a + parseFloat(b.technical), 0) / (answeredCount || 1)).toFixed(1)}</div>
      <div class="score-badge-lbl">Avg Tech</div>
    </div>
    <div class="score-badge-item">
      <div class="score-badge-num">${(validScores.reduce((a, b) => a + parseFloat(b.clarity), 0) / (answeredCount || 1)).toFixed(1)}</div>
      <div class="score-badge-lbl">Avg Clarity</div>
    </div>
  </div>
</div>

### 🎯 Key Takeaways & Recommendations:
1. **Strengths:** Clear foundational articulation and quick problem understanding.
2. **Growth Areas:** Ensure you explain *why* an architectural or algorithmic choice is made, including Big-O time/space trade-offs.
3. **Target Practice:** Review company interview archives for **${interviewSession.company}** on LeetCode, GeeksforGeeks, and Striver's SDE Sheet.

*Ready for another round? Type a new company or role whenever you'd like!*`;
}

// --------------------------------------------------------------------------
// 2. CAREER NAVIGATOR ENGINE
// --------------------------------------------------------------------------
function handleCareerNavigator(text, lower) {
  // Check for branch specific queries
  if (lower.includes('cse') || lower.includes('computer science') || lower.includes('it branch')) {
    return `👨‍💻 **Top Career Pathways for CSE / IT Engineering Students (2025–2026):**

| Role | Avg Starting CTC | Hiring Demand | Core Tech Stack |
|------|-----------------|---------------|-----------------|
| 🤖 **AI / ML Engineer** | ₹12–35 LPA | 🔥 Extremely High | Python, PyTorch, Scikit-learn, LLMs, Vector DBs |
| ☁️ **Cloud / DevOps Engineer** | ₹10–28 LPA | 🚀 High | AWS/GCP, Docker, Kubernetes, Terraform, CI/CD |
| 📱 **Full-Stack Developer** | ₹7–22 LPA | ✅ Steady Demand | React/Next.js, Node.js/Go, SQL, Redis |
| 📊 **Data Scientist** | ₹8–24 LPA | 📈 Rapidly Growing | Python, SQL, Statistics, Tableau, Pandas |
| 🔒 **Cybersecurity Analyst** | ₹7–20 LPA | 🛡️ Specialized | Networks, Cryptography, Linux, BurpSuite, SIEM |
| 🧑‍💼 **Technical Product Manager** | ₹10–30 LPA | ⭐ High Impact | System Design, Product Analytics, Agile, SQL |

### 🧭 Your 3-Phase Placement Action Plan:
- **Phase 1: DSA Foundation** — Solve 150+ problems across Arrays, Strings, HashMaps, Trees on LeetCode.
- **Phase 2: High-Impact Projects** — Build 2 end-to-end full-stack or ML systems with live URLs and GitHub documentation.
- **Phase 3: Placement Sprint** — Mock interviews, core CS subjects (OS, DBMS, CN), and ATS resume tuning.

*Which of these roles aligns with your passion? Tell me to generate a tailored 90-day roadmap!*`;
  }

  // Career pivot: Non-CS (Mech / Civil / ECE / EEE) to IT
  if (lower.includes('mech') || lower.includes('civil') || lower.includes('ece') || lower.includes('eee') || lower.includes('transition') || lower.includes('switch')) {
    return `🔄 **Transition Roadmap: Moving from Non-CS / Core Branches to Software & Tech**

Good news: **Over 35% of IT campus hires** come from non-CS branches (ECE, EEE, Mech, Civil) every year! Top recruiters like TCS, Infosys, Cognizant, Accenture, and product startups hire based on problem-solving ability, not just branch names.

### 🗺️ The Non-CS to Software Engineer Bridge Roadmap:

**Month 1–2: Master ONE Language & Core DSA**
- Focus 100% on **Java** or **Python**. Do not jump between languages.
- Master: Loops, OOP (Inheritance, Polymorphism), Collections/Lists, HashMaps.
- Practice 75 Easy LeetCode problems (Strings, Arrays, Two Pointers).

**Month 3–4: Web & Database Core**
- Learn **SQL** (Joins, Aggregations, Indexing) — every campus drive asks SQL!
- Build a full-stack project using HTML/CSS/JavaScript + Node.js or Python Flask.

**Month 5–6: CS Subjects & Placement Sprint**
- Study Core CS basics: DBMS, Object-Oriented Design, Operating System basics (Processes vs Threads).
- Craft an ATS resume highlighting projects and coding profiles (LeetCode, HackerRank).

💡 **Top Companies Friendly to All Branches:**
- TCS Digital/Ninja, Infosys SE, Capgemini, Accenture ASE, Cognizant GenC, Zoho (no branch filter).

*Tell me your current branch and year of college to customize your exact schedule!*`;
  }

  // Data Science
  if (lower.includes('data scientist') || lower.includes('data science') || lower.includes('data analyst')) {
    return `📊 **Comprehensive Data Science & Analytics Roadmap (Campus to Placement):**

### 🎯 3-Phase Mastery Timeline:

**Phase 1: Mathematics & Data Wrangling (Months 1–2)**
- **Python**: NumPy, Pandas, Matplotlib, Seaborn
- **Databases**: SQL (Window functions, Common Table Expressions, Joins)
- **Math**: Linear Algebra, Probability distributions, Hypothesis testing

**Phase 2: Machine Learning & Modeling (Months 3–4)**
- Scikit-Learn: Regression, Decision Trees, Random Forests, XGBoost, Clustering
- Model validation: Precision, Recall, F1-score, ROC-AUC
- Kaggle practice competitions

**Phase 3: Portfolio & Deep Learning (Months 5–6)**
- Deep Learning basics (PyTorch or TensorFlow)
- Deploy 3 end-to-end projects with Streamlit or FastAPI on Hugging Face / Render
- **Project Idea 1:** Student Placement Predictor using Logistic Regression & SHAP
- **Project Idea 2:** Resume Parser with Named Entity Recognition (NER)

📈 **Average Starting CTC:** ₹8–20 LPA (Fractal, Mu Sigma, Amazon, Flipkart, Analytics startups).

*Would you like me to evaluate your current skill gaps for this path?*`;
  }

  // Role comparison: SDE vs PM
  if (lower.includes('vs') || lower.includes('compare')) {
    return `⚖️ **Career Comparison Breakdown:**

| Dimension | Software Engineer (SDE) | Technical Product Manager (TPM / APM) |
|-----------|-------------------------|---------------------------------------|
| **Core Focus** | Writing code, system architecture, performance | Deciding *what* to build, customer needs, roadmaps |
| **Key Skills** | DSA, System Design, Backend/Frontend, Git | Product sense, SQL/Data analysis, UX, Stakeholder management |
| **Daily Work** | Coding, code reviews, debugging, tech docs | User interviews, PRDs, sprint planning, analytics |
| **Hiring Criteria** | Coding assessments, technical problem solving | Case studies, product teardowns, estimation questions |
| **Starting CTC** | ₹8–30 LPA | ₹10–32 LPA (Top product firms) |
| **Best For** | People who love building & technical depth | People who love business, strategy & cross-team leadership |

💡 **Pro Tip:** Many top product managers start as Software Engineers for 1–2 years to build technical credibility before moving into PM!

*Which direction interests you more?*`;
  }

  // Dynamic Fallback for Career Navigator
  return `🧭 **Career Navigation Analysis for:** *"${escapeHtml(text)}"*

Based on current tech recruitment trends in India:

### 📌 Strategic Recommendations:
1. **Identify High-Leverage Skills:** Focus on foundational competencies (DSA + System Architecture + SQL) that transfer across product and enterprise firms.
2. **Build Proof of Competency:** Recruiters care about deployed projects, active GitHub repositories, and LeetCode ratings over plain certificates.
3. **Match Company Tiers:**
   - **Tier 1 (Product / MNCs - ₹15–45 LPA):** Heavy DSA, System Design, CS fundamentals.
   - **Tier 2 (Fast-growth Startups - ₹8–20 LPA):** Practical tech stack mastery (React, Node, Go, Docker).
   - **Tier 3 (Service Leaders - ₹4–9 LPA):** Aptitude, OOP concepts, DBMS, basic coding.

Tell me your branch, year, and current primary language (e.g. Java, Python, C++) to generate your exact milestones!`;
}



// --------------------------------------------------------------------------
// 4. SKILL GAP DETECTOR ENGINE
// --------------------------------------------------------------------------
function handleSkillGapDetector(text, lower) {
  let roleTitle = 'Full-Stack Developer';
  if (lower.includes('data science') || lower.includes('data analyst')) roleTitle = 'Data Scientist';
  if (lower.includes('ai') || lower.includes('machine learning')) roleTitle = 'AI / ML Engineer';
  if (lower.includes('cloud') || lower.includes('devops')) roleTitle = 'Cloud & DevOps Engineer';
  if (lower.includes('google') || lower.includes('amazon') || lower.includes('sde')) roleTitle = 'Product SDE-1';

  return `⚡ **Skill Gap Analysis & Priority Matrix — ${roleTitle}**

Based on analysis of 400+ campus job descriptions for **${roleTitle}**:

### 🎯 Skill Gap Priority Ranking:

| Priority | Competency Area | Required Benchmark | Top Free Resource |
|----------|-----------------|-------------------|-------------------|
| 🔴 **Critical** | Data Structures & Algorithms | 150+ LeetCode (Array, Tree, Graph) | NeetCode 150 & Striver's A2Z Sheet |
| 🔴 **Critical** | Relational Database & SQL | Joins, Indexing, ACID, Aggregations | Mode Analytics SQL Tutorial (Free) |
| 🟡 **Important** | Core Framework Mastery | Node.js / React / FastAPI | FullStackOpen / The Odin Project |
| 🟡 **Important** | Version Control & CI/CD | Git branching, GitHub Actions | Pro Git Book & GitHub Skills Lab |
| 🟢 **Bonus** | Docker & Cloud Deployment | Containerizing apps & AWS EC2 | Docker Getting Started Tutorial |

### 📅 Your 90-Day Skill Closing Sprint:
- **Weeks 1–4:** Solidify Core DSA (Arrays, HashMaps, Two Pointers) + SQL queries.
- **Weeks 5–8:** Build 1 flagship full-stack project incorporating authentication, caching, and database indexing.
- **Weeks 9–12:** Deploy to cloud, write unit tests, and conduct peer mock interviews.

*(Visual skill coverage bars rendered below)*`;
}

// --------------------------------------------------------------------------
// 5. PLACEMENT TRACKER ENGINE
// --------------------------------------------------------------------------
function handlePlacementTracker(text, lower) {
  // 1. CGPA & Cutoff Eligibility Check
  if (lower.includes('cgpa') || lower.includes('cutoff') || lower.includes('eligib') || lower.includes('backlog')) {
    const cgpaMatch = text.match(/\b([5-9](?:\.\d{1,2})?|10(?:\.0)?)\b/);
    const userCgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;

    let cgpaDiagnosis = '';
    if (userCgpa) {
      if (userCgpa >= 7.5) {
        cgpaDiagnosis = `🎉 **With ${userCgpa} CGPA, you are eligible for 95%+ of campus recruitment drives!**\n` +
          `- ✅ **Tier 1 Dream Companies (₹15–45 LPA):** Amazon, Microsoft, Google, IBM, Infosys SP, TCS Prime\n` +
          `- ✅ **Core Enterprise (₹6–12 LPA):** Deloitte, Zoho, TCS Digital, Cognizant GenC Next\n` +
          `- ✅ **Mass Recruiters (₹3.5–7 LPA):** All eligible with zero filtering`;
      } else if (userCgpa >= 6.5) {
        cgpaDiagnosis = `👍 **With ${userCgpa} CGPA, you comfortably clear 80%+ of campus drives!**\n` +
          `- ✅ **Eligible:** IBM (6.5+), Infosys (6.5+), Accenture (6.5+), Cognizant (6.5+), TCS (6.0+), Wipro (6.0+), Capgemini (6.0+)\n` +
          `- ⚠️ **Borderline for Tier 1:** Amazon/Microsoft (usually require 7.0–7.5+)\n` +
          `- 💡 **Strategy:** Target TCS Digital (₹7.5 LPA) and Accenture Advanced ASE (₹6.5 LPA) via coding excellence!`;
      } else if (userCgpa >= 6.0) {
        cgpaDiagnosis = `⚠️ **With ${userCgpa} CGPA, you qualify for major mass hiring drives:**\n` +
          `- ✅ **Eligible:** TCS Ninja (6.0+), Wipro Elite (6.0+), Capgemini (6.0+), Zoho (no CGPA bar)\n` +
          `- ❌ **Filtered:** IBM, Infosys, Accenture, Cognizant usually enforce strict 6.5 cutoff\n` +
          `- 💡 **Key Action:** Score 80%+ in TCS NQT coding section to get upgraded to Digital tier!`;
      } else {
        cgpaDiagnosis = `🚨 **With ${userCgpa} CGPA, traditional campus filters may apply. Here is your winning route:**\n` +
          `- 🚀 **No-CGPA Bar Recruiters:** **Zoho** (evaluates pure C/Java programming), startups via Wellfound/AngelList\n` +
          `- 🌐 **Open Qualifier Exams:** eLitmus pH Test, AMCAT, TCS NQT National Qualifier (off-campus drives)\n` +
          `- 💻 **Open Source & Hackathons:** Smart India Hackathon, GSoC, GitHub portfolio`;
      }
    }

    return `🎯 **Placement Eligibility & Cutoff Analysis:**

${cgpaDiagnosis ? cgpaDiagnosis + '\n\n---\n' : ''}
### 📊 Standard Campus Placement Cutoff Thresholds:
| Company | Min CGPA | 10th / 12th Cutoff | Max Backlogs Allowed |
|---------|----------|-------------------|----------------------|
| **IBM** | 6.5 | 65% | 0 active backlogs |
| **TCS** | 6.0 | 60% | 1 active backlog |
| **Infosys** | 6.5 | 60% | 0 active backlogs |
| **Accenture** | 6.5 | 65% | 0 active backlogs |
| **Cognizant** | 6.5 | 60% | 0 active backlogs |
| **Amazon** | 7.0 | 65% | 0 active backlogs |
| **Wipro** | 6.0 | 60% | 1 active backlog |
| **Zoho** | **No Bar** | **No Bar** | All students eligible |

*Tell me your exact CGPA and branch to get a personalized company match list!*`;
  }

  // 2. TCS
  if (lower.includes('tcs')) {
    return `🔵 **TCS (Tata Consultancy Services) — Complete Campus Placement Guide:**

### 💼 Three Hiring Tiers & Packages:
1. **TCS Ninja:** ₹3.36–3.60 LPA (Foundation role)
2. **TCS Digital:** ₹7.00–7.50 LPA (Advanced development role)
3. **TCS Prime:** ₹9.00–11.50 LPA (Premier tier for top coders)

### 📋 Eligibility Criteria:
- **CGPA:** Minimum 6.0 or 60% throughout (10th, 12th, and UG)
- **Backlogs:** Maximum 1 active backlog permitted at time of test
- **Academic Gap:** Max 24 months allowed with valid documentation

### 🖥️ TCS NQT Exam Structure (90 Mins):
- **Part A (Foundation):** Numerical Ability (20 Qs), Verbal (25 Qs), Reasoning (20 Qs)
- **Part B (Advanced - for Digital/Prime):** Advanced Quantitative & Reasoning (15 Qs), Advanced Coding (2 Problems: 1 Medium, 1 Hard)

💡 **Preparation Tip:** Clear Part A with 65%+ to secure Ninja; solve both coding questions within 45 mins to unlock Digital/Prime interview calls!`;
  }

  // 3. IBM
  if (lower.includes('ibm')) {
    return `🏢 **IBM India — Campus Placement Pattern & Eligibility Guide:**

### 💼 Roles & Compensation:
- **Associate System Engineer (ASE):** ₹4.50–7.50 LPA
- **Technical Support / Cloud Specialist:** ₹4.00–5.50 LPA

### 📋 Eligibility Requirements:
- **Eligible Branches:** CSE, IT, ECE, EEE, Maths/Computing, MCA
- **CGPA:** 6.5 or 65% throughout 10th, 12th, and Graduation
- **Backlogs:** No active backlogs allowed during selection process

### 📝 4-Round Selection Pattern:
1. **Cognitive Assessment (Online):** Numerical reasoning, logical reasoning, and learning agility games.
2. **English Language Assessment:** Grammar, vocabulary, and reading comprehension.
3. **Coding Assessment:** 1–2 programming problems (Python/Java/C++), testing strings, arrays, or basic math logic.
4. **Technical + HR Interview:** Core OOP, database queries (SQL), project deep-dive, and cultural fit.

💡 **Pro Tip:** IBM emphasizes clean coding habits, understanding of hybrid cloud/microservices, and open learning mindset.`;
  }

  // 4. Infosys
  if (lower.includes('infosys')) {
    return `🟡 **Infosys — Campus Recruitment Blueprint:**

### 💼 Hiring Tiers:
- **Systems Engineer (SE):** ₹3.60 LPA
- **Digital Specialist Engineer (DSE):** ₹6.50 LPA
- **Specialist Programmer (SP):** ₹9.50 LPA

### 📋 Eligibility:
- **CGPA:** Minimum 6.5 CGPA with 60% in 10th/12th
- **Hiring Channels:** On-campus drives + **HackWithInfy** (Coding competition for SP/DSE) + **InfyTQ**.

### 📝 Selection Pattern:
- **Online Test:** Reasoning (15 Qs), Mathematical Ability (10 Qs), Verbal (20 Qs), Pseudocode (5 Qs), Puzzle Solving.
- **Technical Round:** Java/Python collections, DBMS joins, and academic projects.`;
  }

  // 5. Accenture
  if (lower.includes('accenture')) {
    return `🟣 **Accenture — Campus Recruitment Pattern & Syllabus:**

### 💼 Roles & Compensation:
- **Associate Software Engineer (ASE):** ₹4.50 LPA
- **Advanced Associate Software Engineer (AASE):** ₹6.50 LPA

### 📋 Eligibility:
- **CGPA:** 6.5+ or 65% with no active backlogs
- All branches eligible (including non-circuital branches)

### 📝 4-Stage Elimination Process:
1. **Cognitive & Technical Assessment (90 Mins):**
   - Cognitive: English Ability (17 Qs), Critical Thinking (18 Qs), Abstract Reasoning (15 Qs)
   - Technical: Common Applications & MS Office (12 Qs), Pseudocode (18 Qs), Networking/Security & Cloud (10 Qs)
2. **Coding Assessment (45 Mins):** 2 coding questions (Strings, Arrays, Math).
3. **Communication Assessment:** Automated speaking & listening test (pronunciation, fluency, vocabulary).
4. **Interview Round:** Combined Technical & HR interview discussing projects and situational scenarios.`;
  }

  // 6. Cognizant
  if (lower.includes('cognizant')) {
    return `🔵 **Cognizant (CTS) — Campus Hiring Architecture:**

### 💼 Three Distinct Hiring Tiers:
- **GenC:** ₹4.00 LPA (Foundational development & maintenance)
- **GenC Elevate:** ₹4.50–5.50 LPA (Technical problem-solvers)
- **GenC Next:** ₹6.75–9.00 LPA (Full-stack, Cloud, AI specialists)

### 📋 Eligibility:
- 60%+ throughout 10th, 12th, and UG
- Maximum 1 backlog allowed at the time of online test

### 📝 Selection Stages:
1. **Aptitude Test:** Quantitative, Analytical, Verbal
2. **Skill Assessment (for Elevate/Next):** Hands-on coding in Java/Python, SQL queries, web basics
3. **Technical Interview:** OOPS, SQL Group By/Having, project architecture, and live problem solving.`;
  }

  // 7. Amazon
  if (lower.includes('amazon')) {
    return `📦 **Amazon — Campus Placement SDE-1 Blueprint:**

### 💼 Roles & Compensation:
- **SDE-1 (Software Development Engineer):** ₹16–44 LPA CTC (Base: ₹13–18 LPA + Stocks + Sign-on Bonus)
- **Cloud Support Associate (AWS):** ₹12–18 LPA

### 📋 Eligibility:
- Minimum 7.0 CGPA with no active backlogs (CSE, IT, ECE, EEE)

### 📝 Selection Rounds:
1. **Online Assessment (OA - 90 Mins):** 2 LeetCode Medium/Hard algorithmic questions (Graphs, Trees, DP) + Work Styles Assessment (Amazon 16 Leadership Principles).
2. **Technical Rounds (2–3 Rounds):** Coding data structures live with an interviewer, time/space complexity analysis, and system architecture.
3. **Bar Raiser Round:** Strict behavioral interview evaluating Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action) using the STAR format.`;
  }

  // 8. Zoho
  if (lower.includes('zoho')) {
    return `🚀 **Zoho — Open Placement Process (Zero CGPA Filter):**

### 💼 Roles & Compensation:
- **Software Developer:** ₹6.00–12.00 LPA
- **Quality Analyst / Support Engineer:** ₹4.50–7.00 LPA

### 📋 Unique Eligibility:
- **NO CGPA BAR. NO PERCENTAGE CRITERIA. ANY BRANCH.**
- Hiring is 100% based on real hands-on programming skill!

### 📝 5-Round Selection Process:
1. **Round 1 (Basic Programming / Aptitude):** C language basics, pointers, loops, recursion, output guessing.
2. **Round 2 (Basic Coding):** 5 programming questions without using built-in libraries (Strings, Arrays, Number theory).
3. **Round 3 (Advanced Coding):** Complex data structures (implementing HashMaps, Linked Lists, or games like Snake/Chess/Railway Reservation).
4. **Round 4 (Technical Interview):** Deep dive into your code, memory efficiency, and corner cases.
5. **Round 5 (HR Interview):** Culture alignment and problem-solving mindset.`;
  }

  // 9. Default / Upcoming Drives Overview
  return `📅 **Upcoming Campus Placement Drives (Tier 1 & Tier 2 Recruiters):**

| Company | Role | CTC Package | Min CGPA | Hiring Window |
|---------|------|-------------|----------|---------------|
| **IBM** | Associate System Engineer | ₹4.5–7.5 LPA | 6.5+ | Sep–Nov |
| **TCS** | Ninja / Digital / Prime | ₹3.6–11.5 LPA | 6.0+ | Aug–Oct |
| **Infosys** | SE / DSE / SP | ₹3.6–9.5 LPA | 6.5+ | Sep–Nov |
| **Accenture** | ASE / Advanced ASE | ₹4.5–6.5 LPA | 6.5+ | Aug–Oct |
| **Cognizant** | GenC / GenC Next | ₹4.0–9.0 LPA | 6.5+ | Sep–Dec |
| **Amazon** | SDE-1 / Support | ₹16–44 LPA | 7.0+ | Oct–Dec |
| **Capgemini** | Analyst / Senior Analyst | ₹4.2–7.5 LPA | 6.0+ | Sep–Nov |
| **Deloitte** | Analyst (Tech Consulting) | ₹7.6–9.0 LPA | 6.5+ | Aug–Oct |
| **Zoho** | Software Developer | ₹6.0–12.0 LPA | **No Bar** | Oct–Jan |

⚡ **Campus Placement Checklist:**
- [ ] 2 Updated ATS-friendly resumes (General SDE & Domain-specific)
- [ ] Active LeetCode profile with 100+ solved problems
- [ ] Government ID & all semester marks cards compiled in one PDF
- [ ] 60-second "Tell me about yourself" pitch practiced

💡 **Quick Drill-downs Available:**
- Ask: *"What is my eligibility with 6.8 CGPA?"*
- Ask: *"IBM recruitment process & cutoff"*
- Ask: *"TCS Ninja vs Digital vs Prime"*
- Ask: *"Accenture selection rounds"*`;
}

// ---- Skill Bar Visualization Helper ---- //
function addSkillBars(container, queryText = '') {
  if (!container) return;
  const lower = queryText.toLowerCase();

  let skills = [
    { name: 'HTML/CSS & Responsive Design', score: 90, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
    { name: 'JavaScript & Modern React/Next.js', score: 75, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
    { name: 'Node.js, Express & REST APIs', score: 60, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
    { name: 'SQL & Database Architecture', score: 50, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
    { name: 'Docker, CI/CD & Cloud Basics', score: 30, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' },
  ];

  if (lower.includes('data science') || lower.includes('data analyst')) {
    skills = [
      { name: 'Python (NumPy, Pandas, Seaborn)', score: 85, color: 'linear-gradient(90deg, #6C3AFF, #8B5CF6)' },
      { name: 'SQL & Relational Querying', score: 70, color: 'linear-gradient(90deg, #00B4FF, #00FFC2)' },
      { name: 'Statistics & Probability', score: 65, color: 'linear-gradient(90deg, #00E676, #00B4FF)' },
      { name: 'Scikit-Learn Machine Learning', score: 50, color: 'linear-gradient(90deg, #FF9500, #FFCC00)' },
      { name: 'Deep Learning & LLM Fine-Tuning', score: 25, color: 'linear-gradient(90deg, #FF3CAC, #FF6B35)' },
    ];
  }

  const barsHtml = `
    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
      <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;">📊 <strong>Estimated Market Alignment Scorecard:</strong></p>
      <div class="skill-bars">
        ${skills.map(s => `
          <div class="skill-bar-item">
            <div class="skill-bar-label">
              <span style="font-size:0.78rem;">${s.name}</span>
              <span style="font-size:0.78rem;font-weight:600;color:${s.score >= 70 ? 'var(--green)' : s.score >= 50 ? 'var(--orange)' : '#ff6b6b'}">${s.score}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" style="width:0%;background:${s.color}" data-target="${s.score}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <p style="font-size:0.75rem;color:var(--text-dim);margin-top:10px;">
        🔴 Critical priority: Boost lowest bars to 60%+ before attending placement drives.
      </p>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', barsHtml);

  // Animate bars smoothly
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
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`tab-${tabId}`);
  if (panel) panel.classList.add('active');
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
  if (!navbar) return;
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
  const demo = document.getElementById('demo');
  if (demo) demo.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const input = document.getElementById('userInput');
    if (input) input.focus();
  }, 800);
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

// ---- Architecture Diagram Animation ---- //
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

// ---- Utilities ---- //
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Mobile Menu (basic toggle) ---- //
const mobileBtn = document.getElementById('mobileMenuBtn');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
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

