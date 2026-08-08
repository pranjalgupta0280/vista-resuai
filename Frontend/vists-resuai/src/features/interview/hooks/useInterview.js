import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateMoreQuestionsApi } from "../services/interview.api";
import { useContext, useEffect } from "react"; 
import { InterviewContext } from "../interview.context";
import { useParams } from 'react-router';

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.error("generateReport error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    };

    const addMoreQuestions = async ({ interviewId, category }) => {
        let response = null;
        try {
            response = await generateMoreQuestionsApi({ interviewId, category });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.error("addMoreQuestions error:", error);
            throw error;
        }
        return response?.interviewReport;
    };

    const getReportById = async (id) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(id);
            if (response?.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.error("getReportById error:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    };

    const getReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            if (response?.interviewReports) {
                setReports(response.interviewReports);
            }
        } catch (error) {
            console.error("getReports error:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReports;
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return { loading, report, reports, generateReport, getReportById, getReports, addMoreQuestions };
};