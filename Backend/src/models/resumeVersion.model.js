const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    resumeText: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        default: 'Uploaded Resume'
    },
    targetRole: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('resumeVersion', resumeVersionSchema);
