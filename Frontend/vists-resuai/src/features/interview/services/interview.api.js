import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://vista-resuai-4.onrender.com').replace(/\/$/, '');

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, resumeText }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription || "");
    formData.append("selfDescription", selfDescription || "");
    if (resumeFile) {
        formData.append("resume", resumeFile);
    } else if (resumeText) {
        formData.append("resumeText", resumeText);
    }

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

export const generateMoreQuestionsApi = async ({ interviewId, category }) => {
    const response = await api.post(`/api/interview/report/${interviewId}/more-questions`, { category });
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

// Resume Versioning API endpoints
export const getResumeVersions = async () => {
    const response = await api.get("/api/interview/resume-versions");
    return response.data;
};

export const createResumeVersion = async ({ title, resumeText, resumeFile, targetRole }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("targetRole", targetRole || "");
    if (resumeFile) {
        formData.append("resume", resumeFile);
    } else {
        formData.append("resumeText", resumeText || "");
    }

    const response = await api.post("/api/interview/resume-versions", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const deleteResumeVersion = async (versionId) => {
    const response = await api.delete(`/api/interview/resume-versions/${versionId}`);
    return response.data;
};

export const recommendResumeVersion = async ({ jobDescription }) => {
    const response = await api.post("/api/interview/recommend-resume", { jobDescription });
    return response.data;
};

// Daily Coach API endpoints
export const getDailyCoach = async () => {
    const response = await api.get("/api/interview/daily-coach");
    return response.data;
};

export const toggleDailyCoachTask = async (taskId) => {
    const response = await api.patch("/api/interview/daily-coach/toggle-task", { taskId });
    return response.data;
};
