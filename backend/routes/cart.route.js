import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, removeAllFromCart, updateCartQuantity, getCartProducts } from "../controllers/cart.controller.js";

const router=express.Router()

router.post('/', protectRoute, addToCart)
router.delete('/', protectRoute, removeAllFromCart)
router.put(':id', protectRoute, updateCartQuantity)
router.get('/', protectRoute, getCartProducts)

export default router