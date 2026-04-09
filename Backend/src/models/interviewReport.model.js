const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    }
}, {
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "behavioral question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"]
    }
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "task is required"]
    }]
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Please enter job description"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    
    // CORRECTED KEYS HERE:
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model('interviewReports', interviewReportSchema);
module.exports = interviewReportModel;