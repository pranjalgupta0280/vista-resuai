// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { RouterProvider } from "react-router"
import {router} from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
      <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
