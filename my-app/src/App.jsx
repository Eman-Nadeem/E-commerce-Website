import React from 'react'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

const App = () => {
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
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
