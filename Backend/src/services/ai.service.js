const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
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
Return ONLY valid JSON.

Structure:
{
  "matchScore": number,
  "technicalQuestions":[{"question":"","intention":"","answer":""}],
  "behavioralQuestions":[{"question":"","intention":"","answer":""}],
  "skillGaps":[{"skill":"","severity":"low|medium|high"}],
  "preparationPlan":[{"day":1,"focus":"","tasks":[""]}],
  "title":""
}

Resume:${resume}
Self:${selfDescription}
Job:${jobDescription}
`;

  const response = await ai.models.generateContent({
    // model: "gemini-2.0-flash",
    model:"gemini-3-flash-preview",
    // model:"gemini-3.1-pro-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.3
    }
  });

  // ✅ Extract text safely
  const text =
    response.text ||
    response.candidates?.[0]?.content?.parts?.[0]?.text;

  // 🔥 Only raw output log
  console.log("📄 AI Raw Output:\n", text);

  if (!text) {
    throw new Error("AI returned empty response");
  }

  // ✅ Parse + validate (no extra logs)
  const parsed = JSON.parse(text);
  return interviewReportSchema.parse(parsed);
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

Target Job Description:
${jobDescription}

Available Resume Versions:
${versionsFormatted}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });

  const text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("AI returned empty recommendation response");
  }

  const parsed = JSON.parse(text);
  return recommendResumeSchema.parse(parsed);
}

module.exports = { generateInterviewReport, recommendBestResumeVersion };