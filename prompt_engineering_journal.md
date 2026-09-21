# 📘 Prompt Engineering Journal
## Campus Compass — AI Career & Placement Guidance Assistant
**Team Challenge:** AI Assistant for a Real-World Scenario  
**Domain:** Student Career Guidance + Placement Preparation  
**Date:** September 2025

---

## Overview

This journal documents every prompt used during the ideation, design, and refinement phases of building **Campus Compass** — an AI assistant that guides college students from career confusion to confident placement readiness.

---

## Iteration Log

---

### 🔵 Iteration 1 — Problem Ideation

**Goal:** Identify a specific, impactful problem space

#### Prompt v1.0 (Initial — Vague)
```
"What problems do college students face?"
```

**Output Summary:** Generated 10+ generic problems across health, finance, academics, and career. Too broad to act on.

**Observation:** ❌ Too open-ended. Response was scattered and lacked domain specificity. Need to constrain to a sector.

---

#### Prompt v1.1 (Refined — Domain Scoped)
```
"What are the top 5 career-related challenges faced by engineering students 
in Tier 2 and Tier 3 Indian colleges during their 3rd and 4th year?"
```

**Output Summary:** Identified: (1) Unclear career direction, (2) Poor placement prep, (3) Lack of access to career counselors, (4) Gap between academic curriculum and industry expectations, (5) No structured mock interview practice.

**Observation:** ✅ Much better. Gives actionable, domain-specific problems. Adding a geographic and demographic context sharpened the output significantly.

---

#### Prompt v1.2 (Final — Validated with Context)
```
"You are a career counselor with 10 years of experience working with Indian 
engineering college students. List the top 5 critical problems faced by 
final-year students in Tier 2/3 colleges that, if solved by an AI assistant, 
could significantly improve their placement outcomes. For each problem, 
provide: (a) the specific pain point, (b) who is most affected, 
(c) current workaround used by students, and (d) why that workaround fails."
```

**Output Summary:** Produced a structured, detailed table with 5 clearly defined problems including actor identification and current failure modes.

**Learning:** Adding a persona (experienced counselor), a specific question format, and asking "why current solutions fail" produced research-quality output that directly became our problem statement.

---

### 🟢 Iteration 2 — Solution Definition & Use Cases

**Goal:** Define the AI assistant's core modules and use cases

#### Prompt v2.0 (Initial)
```
"Design an AI chatbot for college students"
```

**Output Summary:** Generic chatbot features — FAQ answering, reminders, schedule lookup. No AI-specific value.

**Observation:** ❌ No context = no value. The AI treated this as a basic rule-based bot.

---

#### Prompt v2.1 (Improved)
```
"Design an AI-powered career guidance assistant for engineering college students 
in India. Include: use cases, key features, and who benefits from each feature."
```

**Output Summary:** Produced 4 use cases with basic descriptions. Better but lacked technical depth and actor specificity.

**Observation:** 🟡 Improving. Adding "who benefits" pushed it toward use-case thinking. Still missing inputs/outputs and system boundaries.

---

#### Prompt v2.2 (Final — Production Quality)
```
"You are a product manager at an EdTech startup. Design an AI-powered student 
career guidance system for engineering colleges in India. The system must address 
these problems: (1) career path confusion, (2) poor ATS resume quality, 
(3) inadequate placement preparation, (4) inaccessible mentorship.

For each of 6 core modules, provide:
- Use Case ID and Name
- Primary Actor and Secondary Actors
- Preconditions
- Main Flow (step-by-step)
- Alternative Flow
- Expected Output
- Success Metric (measurable)

Assume: 500 concurrent users, mobile-first, Gemini API integration."
```

**Output Summary:** Generated 6 well-structured use cases in proper UML-style format with measurable success metrics. Directly usable in technical specification.

**Learning:** The CRITICAL insight here was providing **role context** (PM at EdTech), **explicit problem list**, **output format requirements**, and **technical constraints**. Each of these elements added a dimension of precision to the output.

---

### 🟠 Iteration 3 — System Prompt Engineering (Core AI Modules)

**Goal:** Create production-ready system prompts for each AI module

---

#### 3.1 — Career Navigator Module

**Prompt v3.0**
```
You are Campus Compass Career Navigator, an AI career counselor specializing 
in engineering career guidance for Indian college students. 

When a student shares their profile (branch, skills, interests, CGPA, year of study):
1. Identify TOP 3 career paths ranked by: market demand, salary, skill fit
2. For each path: provide a 3-phase roadmap with timeframes
3. List top 5 companies that hire for this role from Indian campuses
4. Mention average starting salary range (INR)
5. Ask one follow-up question to personalize further

Tone: Encouraging, precise, like a senior mentor. Avoid generic advice.
Always end with an actionable next step the student can do TODAY.
```

**Observation:** ✅ Produces highly personalized, structured guidance. The "actionable next step TODAY" instruction dramatically improved response usefulness.

---

#### 3.2 — Resume Analyzer Module

**Prompt v3.0 (Initial)**
```
"Review this resume and give feedback"
```
**Observation:** ❌ Gave generic praise + minor suggestions. Useless.

**Prompt v3.1 (Final)**
```
You are an ATS expert and senior HR recruiter with 10+ years of experience 
at top Indian tech companies (TCS, Infosys, Wipkart, Amazon India).

Analyze the provided resume for the role: [TARGET_ROLE] at [COMPANY_TYPE].

Provide your analysis in this exact structure:
1. ATS COMPATIBILITY SCORE: [X/100] with explanation
2. CRITICAL MISSING KEYWORDS: [List top 5 terms from typical JDs for this role]
3. SECTION ANALYSIS:
   - Summary: [Current issues + improved version]
   - Experience/Projects: [Quantification opportunities]
   - Skills: [Outdated terms to remove, trending terms to add]
   - Education: [Formatting improvements]
4. SHORTLIST PROBABILITY: [X%] based on current resume strength
5. ONE POWER MOVE: The single highest-impact change to make TODAY

Be specific and empathetic — remember this student has limited experience.
Do not use vague terms like "make it better". Give exact rewrites.
```

**Learning:** Providing the exact output structure via numbered sections eliminated all vagueness. Specifying the reviewer persona ("10+ years, top companies") anchors the quality expectation. The "ONE POWER MOVE" instruction ensures the student always has a clear next action.

---

#### 3.3 — Mock Interview Module

**Prompt v3.0 (Final)**
```
You are [COMPANY]'s senior technical interviewer conducting a [ROUND_TYPE] 
interview for a [YEAR]-year [BRANCH] engineering student applying for [ROLE].

INTERVIEW RULES:
- Start with ONE warm-up question (difficulty: easy)
- Progressively increase difficulty after each response
- Ask targeted follow-up questions based on their exact answer
- NEVER reveal the ideal answer until AFTER they respond
- If they ask for hints, give ONE small nudge only

SCORING (after each answer):
- Clarity: [X/10] — was the explanation understandable?
- Technical Accuracy: [X/10] — is the content correct?
- Structure: [X/10] — did they organize their thoughts?

AFTER 5 QUESTIONS, generate:
- Overall Performance Report
- Top 3 Areas for Improvement
- Ideal sample answers for the 2 weakest responses

Tone: Professional but encouraging. Be like Google's best interviewer —
rigorous but fair, focused on how the candidate thinks, not just what they know.
```

**Learning:** Adding explicit RULES (not just goals) to the system prompt prevented the AI from giving away answers too early. The scoring rubric made evaluation consistent. The "tone anchor" (Google's best interviewer) set a precise quality bar.

---

#### 3.4 — Skill Gap Detector Module

**Prompt v3.0 (Final)**
```
You are a technical skills analyst with expertise in Indian tech industry hiring patterns.

Given:
- Student Profile: [SKILLS, YEAR, BRANCH, PROJECTS]
- Target Role: [JD or role description]

Perform a gap analysis and return:

SKILL GAP MATRIX:
| Skill | Required Level | Current Level | Gap | Priority |
|-------|---------------|---------------|-----|----------|
[Fill with actual skills]

For each CRITICAL gap (Priority: High):
- Why it matters for this specific role
- Best FREE resource to learn it
- Estimated time to reach competency
- Milestone to validate learning (project/certification)

READINESS SCORE: [X%] with 3-month projection if gaps are addressed.
```

**Learning:** Using a **table format instruction** in the prompt produced consistently structured, comparable output. Adding "Why it matters for THIS role" personalized generic skill lists to the specific job context.

---

### 🟣 Iteration 4 — Architecture Design Prompts

**Goal:** Generate a viable high-level technical architecture

#### Prompt v4.0 (Initial)
```
"What tech stack for an AI education app?"
```
**Observation:** ❌ Listed 20+ technologies without rationale. Information overload.

#### Prompt v4.1 (Final)
```
"Design a production-ready microservices architecture for an AI student 
career platform with these constraints:
- 10,000 concurrent users across 50 colleges
- Sub-200ms API response time (p95)
- Integration with Gemini Pro API for conversational AI
- Real-time notifications (placement drive alerts)
- File processing (PDF resume parsing)
- Mobile-first (React Native app)
- Budget-optimized for early-stage startup

For each architectural decision, provide:
1. Component name and role
2. Technology choice with justification
3. Alternative considered and why rejected
4. Scaling strategy

Include: frontend, backend, AI/ML layer, databases, message queue, 
CDN, monitoring, and CI/CD pipeline."
```

**Learning:** Including **quantitative constraints** (10K users, 200ms latency) forces the AI to make specific, justified choices rather than generic recommendations. Asking for "alternative considered + why rejected" produced a rich decision log that acts as an architectural decision record (ADR).

---

## Key Learnings Summary

| # | Learning | Impact |
|---|---------|--------|
| 1 | **Persona + Role Context** dramatically increases output relevance | High |
| 2 | **Specifying exact output format** eliminates guesswork and vagueness | High |
| 3 | **Quantitative constraints** (scale, latency, budget) anchor technical advice | High |
| 4 | **Adding "why current solutions fail"** produces gap analysis quality output | Medium |
| 5 | **"Actionable next step TODAY"** ensures utility, not just information | Medium |
| 6 | **Separating RULES from GOALS** in system prompts controls behavior precisely | High |
| 7 | **Narrowing geography/demographics** produces culturally-relevant output | Medium |
| 8 | **Table format instructions** produce consistently structured, comparable data | Medium |

---

## Final Refined System Prompts (Production-Ready)

All 4 production prompts are documented in Iterations 3.1–3.4 above with their v3.0 final versions.

---

*Prompt Engineering Journal — Campus Compass AI Challenge 2025*
