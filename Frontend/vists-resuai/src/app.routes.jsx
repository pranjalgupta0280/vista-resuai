import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/register"
import Home from "./features/auth/pages/home"

export const router=createBrowserRouter([
    {
        path:"/",
        element:<Home/>
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