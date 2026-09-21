# 🎓 Solution Blueprint Document
## Campus Compass — AI Career & Placement Guidance Assistant

**Challenge:** Build an AI Assistant for a Real-World Scenario  
**Domain:** Student Career Guidance + Placement Preparation  
**Version:** 2.0 | **Date:** September 2025

---

## 1. Problem Statement

Over **60% of engineering graduates** in India remain unplaced or underemployed within 6 months of graduation. Despite spending 4 years pursuing technical education, students face a critical readiness gap when entering the job market.

### Root Causes Identified

| Problem | Impact | Affected Users |
|---------|--------|----------------|
| No personalized career direction | Students apply randomly, low conversion | 3rd–4th year students |
| Poor resume quality (non-ATS compliant) | CVs filtered before HR review | All placement students |
| Inadequate interview preparation | Fail technical/HR rounds despite knowledge | Pre-placement students |
| Skill gap between curriculum and industry | Hired for wrong roles, high attrition | Freshers |
| TPOs overwhelmed, no 24/7 guidance | Students can't get timely help | Students + TPO officers |
| No structured placement drive tracking | Students miss deadlines, lose opportunities | All students |

### Why This Matters
- India produces **1.5 million engineering graduates annually**
- Only **~25% of CSE graduates** are directly employable (NASSCOM, 2024)
- A single AI assistant can democratize career guidance previously available only to students at elite institutions

---

## 2. Proposed AI Assistant

**Name:** Campus Compass  
**Tagline:** *"Navigating every student's journey from campus to career."*

Campus Compass is a **conversational AI assistant** powered by Google Gemini 3.1 Flash Lite that delivers personalized, real-time career guidance to college students. It integrates 4 intelligent modules covering career navigation, mock interviews, skill gap detection, and placement tracking — all through a natural language chat interface accessible in any browser.

Unlike generic chatbots, Campus Compass:
- **Adapts** to each student's unique profile (branch, CGPA, skills, interests)
- **Remembers context** across the full conversation — no need to repeat yourself
- **Works offline** via the Smart Engine fallback — no API key required to explore
- **Runs everywhere** — a single HTML file, no install, no server, no account

---

## 3. Target Users

### Primary Users

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| 🎓 **The Confused 3rd Year** | Has skills but no clear career direction | Career path clarity, roadmap |
| 📝 **The Pre-Placement Student** | 4th year, under placement pressure | Interview prep, skill gaps |
| 🔄 **The Career Switcher** | Wants to pivot from ECE/Mech to IT | Skill gap, transition roadmap |
| 🌱 **The First-Gen Learner** | No family/mentor network for guidance | Complete A-Z career guidance |

### Secondary Users

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| 📋 **TPO Officer** | Manages placement drives for 500+ students | Drive information, eligibility queries |
| 🏫 **Faculty Advisor** | Department placement in-charge | Student readiness assessment |

---

## 4. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | System shall generate personalized career path recommendations with roadmaps | Must Have |
| FR-02 | System shall conduct adaptive mock interview sessions | Must Have |
| FR-03 | System shall conduct adaptive mock interview sessions for 50+ companies | Must Have |
| FR-04 | System shall analyze skill gaps and recommend learning resources | Must Have |
| FR-05 | System shall provide placement drive schedules, eligibility, and prep tips | Must Have |
| FR-06 | System shall maintain full conversation context across the session | Must Have |
| FR-07 | System shall fall back to Smart Engine when no API key is provided | Must Have |
| FR-08 | System shall store API key securely in browser localStorage only | Must Have |
| FR-09 | System shall support markdown-formatted, structured AI responses | Should Have |
| FR-10 | System shall provide quick prompt chips for common student queries | Should Have |
| FR-11 | System shall switch between 5 specialized modules seamlessly | Should Have |
| FR-12 | System shall work on mobile and desktop browsers | Should Have |
| FR-13 | System shall generate post-interview performance reports | Should Have |
| FR-14 | System shall provide skill bar visualizations for gap analysis | Could Have |
| FR-15 | System shall require zero installation or backend setup | Must Have |

---

## 5. Key Features

### Module 1: 🧭 Career Path Navigator
- **AI-driven career profiling** based on branch, CGPA, skills, certifications, and interests
- **Multi-path comparison** — ranks top career options with market demand and salary ranges
- **Phase-wise roadmaps** with learning goals and timelines
- **Career switching support** — specialized paths for non-CS students entering IT


### Module 3: 🎙️ Mock Interview Coach
- **Company-specific question banks** (Google, Amazon, TCS, Infosys, Wipro, Zoho, and more)
- **Adaptive multi-turn sessions** — interactive Q&A state machine
- **Real-time STAR scoring** — Clarity, Technical Accuracy, Structure (each /10)
- **Hint system** — nudges without revealing the full answer
- **Post-session report** — performance summary, weak areas, sample ideal answers

### Module 4: ⚡ Skill Gap Detector
- **Gap priority matrix** — critical, important, and nice-to-have skills identified
- **Resource curation** — top courses and resources per skill
- **Timeline estimation** — study plan with realistic milestones
- **Visual skill bars** — progress visualization by tech stack

### Module 5: 🏢 Placement Drive Tracker
- **Company information** — schedules, eligibility, CTC, and process details
- **Eligibility checking** — branch, CGPA, and backlog filters
- **Preparation packs** — company-specific tips and question patterns
- **Drive calendar** — season-wise schedule (August through April)

---

## 6. Inputs and Outputs

| Module | User Inputs | AI Processing | Expected Outputs |
|--------|-------------|---------------|-----------------|
| **Career Navigator** | Branch, Year, Skills, Interests | Gemini 3.5 Flash + campus system prompt | Ranked career paths, Phase-wise roadmap, Salary range, Next action |
| **Career Navigator** | Branch, Year, Skills, Interests | Gemini 3.1 Flash Lite + campus system prompt | Ranked career paths, Phase-wise roadmap, Salary range, Next action |
| **Mock Interview** | Company name, Role, Round type | Multi-turn state machine + Gemini evaluation | Q&A transcript, Per-question scores, Weak areas, Sample answers |
| **Skill Gap Detector** | Job description / target role, Current skills | LLM gap analysis + resource lookup | Gap matrix, Priority-ordered list, Study resources, Timeline |
| **Placement Tracker** | Company name / query | Drive knowledge base + eligibility filter | Drive schedule, Eligibility status, Prep tips, Application advice |

---

## 7. System Architecture

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                       USER LAYER                         │
│   Browser (Desktop / Mobile) — any modern browser        │
└───────────────────────┬──────────────────────────────────┘
                        │ User interaction
┌───────────────────────▼──────────────────────────────────┐
│              STATIC WEB APPLICATION                      │
│   index.html + styles.css + app.js                       │
│   Single file — no build step — no server required       │
│                                                          │
│   ┌────────────┐  ┌──────────────┐  ┌───────────────┐   │
│   │  5 Module  │  │  Chat Engine │  │ Smart Engine  │   │
│   │  Selector  │  │  (multi-turn)│  │ (offline mode)│   │
│   └────────────┘  └──────┬───────┘  └───────────────┘   │
└──────────────────────────┼───────────────────────────────┘
                           │ HTTPS fetch (Gemini API)
┌──────────────────────────▼───────────────────────────────┐
│                   GOOGLE GEMINI API                      │
│   Model: gemini-3.5-flash-lite                                │
│   System Prompt: Campus career counselor persona         │
│   Context: Rolling 10-turn conversation history          │
│   Config: temp=0.75, maxTokens=1200                      │
└──────────────────────────┬───────────────────────────────┘
                           │ Response streamed back
┌──────────────────────────▼───────────────────────────────┐
│                  CLIENT-SIDE STATE                       │
│   localStorage: API key (never sent to any server)       │
│   JS Memory: Chat history, interview session state       │
└──────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Zero-backend by design:** The entire application runs client-side. No server, no database, no DevOps required. This makes it instantly deployable and shareable via a single link.

2. **Gemini 3.5 Flash as the AI engine:** Chosen for speed, quality, and the generous free tier. The API is called directly from the browser using the user's own API key — their key, their quota.

3. **Rolling 10-turn conversation memory:** The last 10 message turns are included in every API call, giving Gemini full context to avoid repetitive questions and maintain coherent multi-turn conversations.

4. **4 Domain-Specific System Prompts:** Four distinct, domain-specialized system prompts instruct Gemini (Career Navigator, Mock Interview, Skill Gap Detector, and Placement Tracker) to behave as an experienced Indian campus placement counselor, ensuring responses stay relevant, structured, and motivating.

5. **Smart Engine fallback:** When no API key is provided (or if the API fails), the app falls back to a built-in rules-based engine with pre-engineered responses for all 5 modules — ensuring 100% uptime.

6. **API key stays local:** The key is stored exclusively in `localStorage`. It never leaves the user's browser. No tracking, no telemetry.

---

## 8. Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | No framework needed — keeps the app lightweight, dependency-free, and shareable as a single file |
| **Fonts** | Google Fonts (Inter, Space Grotesk) | Professional typography without build tooling |
| **AI Engine** | Google Gemini 3.5 Flash | State-of-the-art conversational reasoning; fast inference; generous free tier; direct browser API access |
| **API Protocol** | Generative Language API (REST/JSON) | Simple fetch() call, no SDK required |
| **Session State** | JavaScript in-memory | Chat history, interview state machine, module context |
| **Persistence** | Browser localStorage | API key stored locally; no backend required |
| **Hosting** | GitHub Pages / any static host | Zero-cost, zero-config, globally accessible |
| **Version Control** | GitHub | Source at github.com/AnwayeeDas05/ltm_project |

---

## 9. Expected Benefits and Impact

### For Students
| Benefit | Measurable Metric |
|---------|------------------|
| Career Clarity | Clear career direction within 1–2 conversations |
| Interview Readiness | Full mock interview with scored feedback in < 10 min |
| Interview Practice | On-demand mock sessions instead of scheduling with a counselor |
| 24/7 Availability | Zero waiting time vs. 3–5 days for appointments |
| Accessibility | Works on any device with a browser — no app install |

### For Institutions
| Benefit | Measurable Metric |
|---------|------------------|
| Reduced TPO load | Students get common guidance instantly, freeing TPOs for complex cases |
| Cost savings | Zero infrastructure cost — runs on student's own device |
| Higher placement readiness | Students arrive better prepared for drives |

---

## 10. Future Enhancements

### Phase 1 — Foundation ✅ (Current)
- 5-module AI chat interface
- Gemini 3.5 Flash integration with multi-turn memory
- Smart Engine offline fallback
- Static single-file deployment

### Phase 2 — Intelligence Layer
- **Voice interview practice** — speech recognition + pronunciation feedback
- **Voice-based mock interviews** — natural spoken practice sessions
- **Personalized learning tracker** — save progress across sessions

### Phase 3 — Platform
- **Shareable roadmaps** — generate and export career roadmap PDFs
- **Multi-language support** — Hindi, Tamil, Telugu, Bengali
- **Employer portal** — companies post drives, students apply directly

### Phase 4 — Ecosystem
- **College-wide deployment** — TPO dashboard for bulk student management
- **Alumni network integration** — AI mentor matching
- **Predictive analytics** — readiness heatmaps, placement outcome forecasting

---

## Summary

Campus Compass is a **fully functional AI career assistant** that runs entirely in the browser — no backend, no installation, no account required. It combines the power of Google Gemini 3.5 Flash with a deep understanding of Indian campus placements to deliver personalized guidance across 5 modules, instantly and for free.

> *"Every student deserves a career counselor in their pocket."*

---

*Solution Blueprint Document v2.0 — Campus Compass | September 2025*
