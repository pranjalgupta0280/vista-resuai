const pdfParse = require("pdf-parse");
const { generateInterviewReport, recommendBestResumeVersion } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const resumeVersionModel = require("../models/resumeVersion.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";
        if (req.file) {
            const pdfParsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = pdfParsed.text;
        } else if (req.body.resumeText) {
            resumeText = req.body.resumeText;
        }

        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore,
            skillGaps: interViewReportByAi.skillGaps,
            preparationPlan: interViewReportByAi.preparationPlan,
            technicalQuestions: interViewReportByAi.technicalQuestions, 
            behavioralQuestions: interViewReportByAi.behavioralQuestions,
            title: interViewReportByAi.title
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

async function getInterviewReportByIdController(req,res){
    const {interviewId}=req.params;
    const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id})
    if(!interviewReport)
    {
        return res.status(404).json({
            message:"interview report not found."
        })
    }
    res.status(200).json({
        message:"Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res)
{
    const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
     res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

// ── Resume Versions Controllers ───────────────────────────────────────────────

async function createResumeVersionController(req, res) {
    try {
        const { title, resumeText, targetRole } = req.body;
        let content = resumeText || "";
        let fileName = "Custom Version";

        if (req.file) {
            const pdfParsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            content = pdfParsed.text;
            fileName = req.file.originalname || "Uploaded File";
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Please provide a title and resume content." });
        }

        const version = await resumeVersionModel.create({
            user: req.user.id,
            title,
            resumeText: content,
            fileName,
            targetRole: targetRole || ''
        });

        return res.status(201).json({
            message: "Resume version saved successfully.",
            version
        });
    } catch (error) {
        console.error("createResumeVersionController error:", error);
        return res.status(500).json({ message: "Failed to save resume version.", error: error.message });
    }
}

async function getResumeVersionsController(req, res) {
    try {
        const versions = await resumeVersionModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ versions });
    } catch (error) {
        console.error("getResumeVersionsController error:", error);
        return res.status(500).json({ message: "Failed to fetch resume versions." });
    }
}

async function deleteResumeVersionController(req, res) {
    try {
        const { id } = req.params;
        await resumeVersionModel.deleteOne({ _id: id, user: req.user.id });
        return res.status(200).json({ message: "Resume version deleted." });
    } catch (error) {
        console.error("deleteResumeVersionController error:", error);
        return res.status(500).json({ message: "Failed to delete resume version." });
    }
}

async function recommendResumeVersionController(req, res) {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        const versions = await resumeVersionModel.find({ user: req.user.id });
        if (!versions || versions.length === 0) {
            return res.status(400).json({ message: "No saved resume versions found. Please add versions in your Resume Vault first." });
        }

        const recommendation = await recommendBestResumeVersion({ jobDescription, resumeVersions: versions });
        return res.status(200).json({ recommendation });
    } catch (error) {
        console.error("recommendResumeVersionController error:", error);
        return res.status(500).json({ message: "Failed to recommend resume version.", error: error.message });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    createResumeVersionController,
    getResumeVersionsController,
    deleteResumeVersionController,
    recommendResumeVersionController
};