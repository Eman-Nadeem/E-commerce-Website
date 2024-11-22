import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../backend/routes/auth.route.js'
import { connect } from './lib/connect.js'
import cookieParser from 'cookie-parser'
import productRoutes from '../backend/routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentsRoutes from './routes/payment.route.js'

const app=express()
dotenv.config()

const PORT=process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentsRoutes)

app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
  connect()
})

