import React, { useEffect } from 'react'
import HomePage from './pages/HomePage'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import useUserStore  from './stores/useUserStore.js'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import AdminPage from './pages/AdminPage.jsx'

const App = () => {
  const {user, checkAuth, checkingAuth}=useUserStore()

  //as soon as user visits our application we would like to run this function

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  if(checkingAuth) return <LoadingSpinner/>

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      
      {/* green gradient */}
      <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

      {/* purple gradient  */}
      {/* <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0'>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(128,0,128,0.3)_0%,rgba(75,0,130,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
          </div>
      </div> */}
       
       {/* pt-20 adjusted to pt10 */}
      <div className='relative z-50 pt-10'>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user? <SignUpPage /> : <Navigate to={'/'} />} />
          <Route path="/login" element={!user?  <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/secret-dashboard" element={user?.role==="admin"? <AdminPage/> : <Navigate to={'/login'} />} />
          {/* if user state from userStore is not null then login page is shown if user is logged in then HomePage is shown */}
        </Routes>
      </div>
      <Toaster/>
    </div>
  )
}

export default App
