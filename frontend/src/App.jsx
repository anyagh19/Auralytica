import React, { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Resigter from './pages/Resigter'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Services from '../modules/common/components/Services'
import About from '../modules/common/components/About'
import Contact from '../modules/common/components/Contact'
import Dashboard from '../modules/user/components/Dashboard'
import Inventory from '../modules/user/components/Inventory'
import SalesPredictionApp from '../modules/inventory/components/Prediction'
import InventoryTable from '../modules/inventory/components/InventoryTable'

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

    <Routes>
      <Route
        path='/'
        element={

          <Home />

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
        path='/services'
        element={<Services />}
      />
      <Route
        path='/about'
        element={<About />}
      />
      <Route
        path='/contact'
        element={<Contact />}
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>

        }
      />
      <Route
        path='/inventory'
        element={
          <ProtectedRoutes>
            <InventoryTable />
          </ProtectedRoutes>

        }
      />
      <Route
        path='/prediction'
        element={
          <ProtectedRoutes>
            <SalesPredictionApp />
          </ProtectedRoutes>

        }
      />
      <Route
        path='*'
        element={<NotFound />}
      />
    </Routes>
  )
}

export default App
