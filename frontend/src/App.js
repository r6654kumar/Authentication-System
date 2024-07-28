import React from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import Home from './Components/Home'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'
import Dashboard from './Components/Dashboard'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App