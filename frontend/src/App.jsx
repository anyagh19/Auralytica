import React, { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Resigter from './pages/Resigter'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function LogOut() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogOut() {
  localStorage.clear()
  return <Resigter />
}

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route 
        path='/login'
        element={<Login />}
        />
        <Route 
        path='/register'
        element={<Resigter />}
        />
        <Route 
        path='*'
        element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
