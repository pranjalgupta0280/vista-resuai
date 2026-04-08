const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewController=require("../controllers/inerview.controller")

const interviewRouter=express.Router()


interviewRouter.post("/",authMiddleware.authUser,interviewController.generateInterViewReportController)
module.exports=interviewRouter