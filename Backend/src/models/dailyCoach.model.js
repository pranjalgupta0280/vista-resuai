const mongoose = require('mongoose');

const dailyCoachSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    streakCount: {
        type: Number,
        default: 1
    },
    yesterdayRecap: [{
        type: String
    }],
    todayTasks: [{
        id: String,
        text: String,
        estMinutes: Number,
        completed: Boolean
    }],
    totalEstMinutes: {
        type: Number,
        default: 90
    }
}, { timestamps: true });

module.exports = mongoose.model('dailyCoach', dailyCoachSchema);
