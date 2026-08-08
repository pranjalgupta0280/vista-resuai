const Groq = require("groq-sdk");
const { z } = require("zod");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "GROQ_API_KEY_NOT_SET"
});

// ✅ Schema
const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string().min(10)
  })),
  behavioralQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string().min(10)
  })),
  skillGaps: z.array(z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"])
  })),
  preparationPlan: z.array(z.object({
    day: z.number(),
    focus: z.string(),
    tasks: z.array(z.string())
  })),
  title: z.string()
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
Return ONLY valid JSON matching this structure:

{
  "matchScore": number_0_to_100,
  "technicalQuestions": [
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""}
  ],
  "behavioralQuestions": [
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""},
    {"question":"","intention":"","answer":""}
  ],
  "skillGaps":[{"skill":"","severity":"low|medium|high"}],
  "preparationPlan": [
    {"day": 1, "focus": "Phase/Step 1 Title", "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 2, "focus": "Phase/Step 2 Title", "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 3, "focus": "Phase/Step 3 Title", "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 4, "focus": "Phase/Step 4 Title", "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 5, "focus": "Phase/Step 5 Title", "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 6, "focus": "Phase/Step 6 Title", "tasks": ["Task 1", "Task 2", "Task 3"]}
  ],
  "title": ""
}

INSTRUCTIONS & STRICT SCORING RUBRIC:
1. Compute matchScore (0 to 100 integer) analytically based on 4 weighted criteria:
   - Technical Stack & Skill Coverage (Max 35 pts): Award points for exact matches with required languages, frameworks, tools, and databases. Deduct heavily for missing core tech skills required by the job description.
   - Project Complexity & Practical Relevance (Max 30 pts): Evaluate depth, architecture, full-stack features, and relevance of projects listed.
   - Achievements, Competitive Ranks & Honors (Max 20 pts): Award points for verified competitive coding achievements (Meta Hacker Cup, Codeforces, LeetCode Knight, hackathons, contest ranks), academic honors, or quantifiable metrics. Resumes with strong achievements MUST score higher than resumes lacking them.
   - Self-Description & Role Alignment (Max 15 pts): Alignment of candidate self-description with company goals.
2. CRITICAL: Do NOT round matchScore to generic numbers (e.g., 80 or 85). Compute exact, highly discriminating integer scores (e.g. 73, 91, 64, 88). Two resumes with different achievements or projects MUST receive noticeably different match scores!
3. Provide EXACTLY 5 Technical Questions and 5 Behavioral Questions.
4. Provide a detailed Preparation Roadmap of EXACTLY 6 sequential steps/phases covering core tech fundamentals, architecture, system design, performance, behavioral STAR preparation, and mock interview practice. Do NOT reference days in step focus titles.

Resume:${resume}
Self:${selfDescription}
Job:${jobDescription}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert technical interviewer, ATS evaluator, and career coach. Return ONLY valid JSON adhering to the requested format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.1
  });

  const text = response.choices[0]?.message?.content;

  // 🔥 Only raw output log
  console.log("📄 AI Raw Output:\n", text);

  if (!text) {
    throw new Error("AI returned empty response");
  }

  // ✅ Parse + validate (no extra logs)
  const parsed = JSON.parse(text);
  return interviewReportSchema.parse(parsed);
}

const moreQuestionsSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string().min(10)
  }))
});

async function generateMoreQuestions({ category, jobDescription, resume, selfDescription, existingQuestions = [] }) {
  const existingList = existingQuestions.map(q => q.question).join("\n- ");
  const categoryLabel = category === "behavioral" ? "Behavioral" : "Technical";

  const prompt = `
Generate EXACTLY 5 NEW and UNIQUE ${categoryLabel} interview questions with detailed intentions and model answers tailored for this role.

Target Job Description:
${jobDescription}

Resume Context:
${resume}

Candidate Self-Description:
${selfDescription}

Existing questions (DO NOT REPEAT ANY OF THESE):
- ${existingList}

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "question": "Question text",
      "intention": "What the interviewer tests",
      "answer": "Detailed high-scoring model answer"
    }
  ]
}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert ${categoryLabel.toLowerCase()} interviewer. Return ONLY valid JSON adhering to the requested schema.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.3
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("AI returned empty questions response");
  }

  const parsed = JSON.parse(text);
  const validated = moreQuestionsSchema.parse(parsed);
  return validated.questions;
}

const recommendResumeSchema = z.object({
  recommendedVersionId: z.string(),
  recommendedTitle: z.string(),
  atsScore: z.number(),
  reason: z.string(),
  versionScores: z.array(z.object({
    versionId: z.string(),
    title: z.string(),
    score: z.number(),
    summary: z.string()
  }))
});

async function recommendBestResumeVersion({ jobDescription, resumeVersions }) {
  const versionsFormatted = resumeVersions.map(v => `ID: ${v._id}\nTitle: ${v.title}\nResume Content: ${v.resumeText.slice(0, 1500)}`).join("\n---\n");

  const prompt = `
Return ONLY valid JSON matching this structure:
{
  "recommendedVersionId": "version_id_here",
  "recommendedTitle": "version_title_here",
  "atsScore": number_0_to_100,
  "reason": "Detailed explanation of why this resume version is the best fit for this specific Job Description.",
  "versionScores": [
    {
      "versionId": "version_id_here",
      "title": "version_title_here",
      "score": number_0_to_100,
      "summary": "Brief analysis of fit"
    }
  ]
}

INSTRUCTIONS & STRICT SCORING RUBRIC:
1. Evaluate each resume version against the Target Job Description using this weighted 100-point rubric:
   - Technical Stack & Skill Coverage (Max 35 pts)
   - Project Relevance & Depth (Max 30 pts)
   - Competitive Ranks & Achievements (Max 20 pts): Strongly reward contest ranks (Meta Hacker Cup, Codeforces, LeetCode Knight), hackathons, and certifications.
   - Role & Communication Alignment (Max 15 pts)
2. CRITICAL: Compute precise, non-rounded integer scores (e.g. 93, 76, 61) reflecting exact differences in achievements, project relevance, and tech stack coverage between versions.

Target Job Description:
${jobDescription}

Available Resume Versions:
${versionsFormatted}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert ATS reviewer and career strategist. Return ONLY valid JSON adhering to the requested format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.1
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("AI returned empty recommendation response");
  }

  const parsed = JSON.parse(text);
  return recommendResumeSchema.parse(parsed);
}

module.exports = { generateInterviewReport, generateMoreQuestions, recommendBestResumeVersion };