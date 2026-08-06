import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import DailyCoachPage from "./features/interview/pages/dailyCoachPage";
import CreateStrategyPage from "./features/interview/pages/createStrategyPage";
import MyPlansPage from "./features/interview/pages/myPlansPage";
import Protected from "./features/auth/components/Protected";
import Interview from "./features/interview/pages/interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><DailyCoachPage /></Protected>
    },
    {
        path: "/create",
        element: <Protected><CreateStrategyPage /></Protected>
    },
    {
        path: "/plans",
        element: <Protected><MyPlansPage /></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/interview/:interviewId?",
        element: <Protected><Interview /></Protected>
    },
]);