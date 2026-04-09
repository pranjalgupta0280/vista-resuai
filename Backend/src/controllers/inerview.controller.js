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
    const interviewReports=(await interviewReportModel.find({user:req.user.id})).toSorted({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
     res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })

}
module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController };