const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

const allowedOrigins = [
    'https://vista-resuai.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
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