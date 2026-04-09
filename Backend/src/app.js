const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require("cors")
const app =express();

app.use(cors({
    origin: [
        'http://localhost:5173', // Keep local testing working
        'https://vista-resuai-btc4dhv0g-pranjalgupta0280s-projects.vercel.app', // The specific URL from your error
        /\.vercel\.app$/ // This "Regex" allows ANY subdomain from your Vercel account
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./routes/auth.route");
const interviewRouter=require("./routes/interview.route")
app.use("/api/auth",authRouter);    
app.use("/api/interview",interviewRouter)

module.exports=app