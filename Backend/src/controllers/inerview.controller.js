const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore,
            skillGaps: interViewReportByAi.skillGaps,
            preparationPlan: interViewReportByAi.preparationPlan,
            
            // CORRECTED KEYS HERE:
            technicalQuestions: interViewReportByAi.technicalQuestions, 
            behavioralQuestions: interViewReportByAi.behavioralQuestions
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);

        if (error.status === 503 || (error.message && error.message.includes('503'))) {
            return res.status(503).json({
                success: false,
                message: "The AI engine is currently experiencing high traffic. Please wait a few seconds and try again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while generating your report.",
            error: error.message
        });
    }
}

module.exports = { generateInterViewReportController };