const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require("cors")
const app =express();

app.use(cors({
    origin: [
        'https://vista-resuai.vercel.app', // YOUR ACTUAL VERCEL URL
        'http://localhost:5173'
    ],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./routes/auth.route");
const interviewRouter=require("./routes/interview.route")
app.use("/api/auth",authRouter);    
app.use("/api/interview",interviewRouter)

module.exports=app