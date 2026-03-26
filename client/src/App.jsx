import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import Navbar from './components/Navbar'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RecoilRoot } from "recoil"
import Dashboard from './routes/Dashboard'
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from './components/PublicRoute'
const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
