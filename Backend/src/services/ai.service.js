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
    answer: z.string()
  })),
  behavioralQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
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
    // model: "gemini-2.5-flash",
    model:"gemini-3-flash-preview",
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

module.exports = {generateInterviewReport};