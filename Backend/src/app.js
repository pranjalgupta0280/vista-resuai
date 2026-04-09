const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

// 1. THE REFRESHED CORS SETUP
app.use(cors({
    origin: true, // This is the "Nuclear" debug setting: it allows whatever URL is calling it
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 2. EXPLICIT PRE-FLIGHT HANDLER
// This ensures that when the browser asks "Can I talk to you?", 
// the server immediately says "Yes" with a 200 OK status.
app.options('*', cors()); 

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

app.use("/api/auth", authRouter);    
app.use("/api/interview", interviewRouter);

module.exports = app;