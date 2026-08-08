const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateMoreQuestions, recommendBestResumeVersion } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const resumeVersionModel = require("../models/resumeVersion.model");
const dailyCoachModel = require("../models/dailyCoach.model");

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

// ── Daily Coach Controllers ──────────────────────────────────────────────────

async function getDailyCoachController(req, res) {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        let coach = await dailyCoachModel.findOne({ user: req.user.id, date: todayStr });

        if (!coach) {
            // Calculate streak count by looking at recent daily records
            const previousCoaches = await dailyCoachModel.find({ user: req.user.id }).sort({ date: -1 }).limit(1);
            let streak = 1;
            if (previousCoaches && previousCoaches.length > 0) {
                streak = previousCoaches[0].streakCount + 1;
            }

            const defaultTasks = [
                { id: 't1', text: 'Learn Redis & System Caching Strategy', estMinutes: 30, completed: false },
                { id: 't2', text: 'Solve 2 Graph & Data Structure Questions', estMinutes: 40, completed: false },
                { id: 't3', text: 'Interactive Mock Interview Review', estMinutes: 20, completed: false }
            ];

            const defaultRecap = [
                '✓ Resume Version Updated',
                '✓ 1 Interview Plan Generated'
            ];

            coach = await dailyCoachModel.create({
                user: req.user.id,
                date: todayStr,
                streakCount: streak,
                yesterdayRecap: defaultRecap,
                todayTasks: defaultTasks,
                totalEstMinutes: 90
            });
        }

        return res.status(200).json({ coach });
    } catch (error) {
        console.error("getDailyCoachController error:", error);
        return res.status(500).json({ message: "Failed to fetch daily coach details." });
    }
}

async function toggleDailyCoachTaskController(req, res) {
    try {
        const { taskId } = req.body;
        const todayStr = new Date().toISOString().split('T')[0];
        const coach = await dailyCoachModel.findOne({ user: req.user.id, date: todayStr });

        if (!coach) {
            return res.status(404).json({ message: "Daily coach record not found." });
        }

        const task = coach.todayTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            await coach.save();
        }

        return res.status(200).json({ coach });
    } catch (error) {
        console.error("toggleDailyCoachTaskController error:", error);
        return res.status(500).json({ message: "Failed to toggle daily task." });
    }
}

async function generateMoreQuestionsController(req, res) {
    try {
        const { interviewId } = req.params;
        const { category } = req.body;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const targetCategory = category === 'behavioral' ? 'behavioral' : 'technical';
        const existingQuestions = targetCategory === 'behavioral' 
            ? interviewReport.behavioralQuestions 
            : interviewReport.technicalQuestions;

        const newQuestions = await generateMoreQuestions({
            category: targetCategory,
            jobDescription: interviewReport.jobDescription,
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            existingQuestions
        });

        if (targetCategory === 'behavioral') {
            interviewReport.behavioralQuestions.push(...newQuestions);
        } else {
            interviewReport.technicalQuestions.push(...newQuestions);
        }

        await interviewReport.save();

        return res.status(200).json({
            message: `5 more ${targetCategory} questions generated successfully.`,
            interviewReport
        });
    } catch (error) {
        console.error("generateMoreQuestionsController error:", error);
        return res.status(500).json({ message: "Failed to generate additional questions.", error: error.message });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    createResumeVersionController,
    getResumeVersionsController,
    deleteResumeVersionController,
    recommendResumeVersionController,
    getDailyCoachController,
    toggleDailyCoachTaskController,
    generateMoreQuestionsController
};