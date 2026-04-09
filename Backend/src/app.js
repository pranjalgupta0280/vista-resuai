const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

// 1. GLOBAL CORS MIDDLEWARE
// This is all you need. It handles GET, POST, and the hidden OPTIONS 
// requests automatically without needing any wildcard characters.
app.use(cors({
    origin: true, // Allows your Vercel URL to connect
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 🛑 DO NOT add app.options('*') or app.options('(.*)') here.
// They are causing the PathError crash in Node v22.

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

app.use("/api/auth", authRouter);    
app.use("/api/interview", interviewRouter);

module.exports = app;