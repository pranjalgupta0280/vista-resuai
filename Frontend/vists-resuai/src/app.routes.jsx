import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/register"
import Home from "./features/interview/pages/home"
import Protected from "./features/auth/components/Protected"
import Interview from "./features/interview/pages/interview"

export const router=createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/interview/:interviewId?",
        element:<Protected><Interview/></Protected>
    },
    
])