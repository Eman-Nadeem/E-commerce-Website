import express from 'express'
import { login, logout, signup, refreshToken } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getProfile } from '../controllers/auth.controller.js'

const router=express.Router()

router.get('/profile', protectRoute, getProfile)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/login', login)
router.post('/refresh-token', refreshToken)

export default router