import express from 'express'
import { getAllProducts, createProducts, deleteProducts, getFeaturedProducts } from '../controllers/product.controller.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'

const router=express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/', getFeaturedProducts)
router.post('/', protectRoute, adminRoute, createProducts)
router.post('/:id', protectRoute, adminRoute, deleteProducts)

export default router