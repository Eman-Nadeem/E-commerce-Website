import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../backend/routes/auth.route.js'
import { connect } from './lib/connect.js'
import cookieParser from 'cookie-parser'
import productRoutes from '../backend/routes/product.route.js'
import cartRoutes from './routes/cart.route.js'

const app=express()
dotenv.config()

const PORT=process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
  connect()
})

