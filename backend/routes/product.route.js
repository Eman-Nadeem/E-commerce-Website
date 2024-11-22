import express from 'express'
import { getAllProducts, createProducts, deleteProducts, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } from '../controllers/product.controller.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'

const router=express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/', getFeaturedProducts)
router.post('/', protectRoute, adminRoute, createProducts)
router.delete('/:id', protectRoute, adminRoute, deleteProducts)
router.get('/recommendations', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct)

export default router