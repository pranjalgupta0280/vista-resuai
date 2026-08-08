const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewController=require("../controllers/inerview.controller")
const upload=require("../middlewares/file.middleware")
const interviewRouter=express.Router()


interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController);
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);
interviewRouter.post("/report/:interviewId/more-questions", authMiddleware.authUser, interviewController.generateMoreQuestionsController);
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

// Resume Versioning endpoints
interviewRouter.get("/resume-versions", authMiddleware.authUser, interviewController.getResumeVersionsController);
interviewRouter.post("/resume-versions", authMiddleware.authUser, upload.single("resume"), interviewController.createResumeVersionController);
interviewRouter.delete("/resume-versions/:id", authMiddleware.authUser, interviewController.deleteResumeVersionController);
interviewRouter.post("/recommend-resume", authMiddleware.authUser, interviewController.recommendResumeVersionController);

// Daily Coach endpoints
interviewRouter.get("/daily-coach", authMiddleware.authUser, interviewController.getDailyCoachController);
interviewRouter.patch("/daily-coach/toggle-task", authMiddleware.authUser, interviewController.toggleDailyCoachTaskController);

module.exports = interviewRouter;

