const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

// 1. THE REFRESHED CORS SETUP
// 1. Keep this as is (at the very top)
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 2. CHANGE THIS LINE (The one that caused the crash)
// Replace the '*' with the new wildcard syntax:
app.options('(.*)', cors()); 

// ... rest of your code
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

app.use("/api/auth", authRouter);    
app.use("/api/interview", interviewRouter);

module.exports = app;