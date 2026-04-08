import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/register"
import Home from "./features/auth/pages/home"
import Protected from "./features/auth/components/Protected"

export const router=createBrowserRouter([
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
])