import JWT from 'jsonwebtoken'
import User from '../models/product.model.js'

export const protectRoute= async (req, res, next)=>{
  try{
    const accessToken=req.cookies.accessToken
    if(!accessToken){
      return res.status(401).json({message: 'No access token provided'})
    }

    try{
      const decoded=JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      const user=await User.findById(decoded.userId).select('-password')
      
      if(!user){
        return res.status(401).json({message: 'User not found!'})
      }

      req.user=user
      next()
    }catch(error){
      if(error.name==='TokenExpiredError'){
        return res.status(401).json({message: 'Unauthorized - Token expired!'})
      }
      throw error;
    }
  }catch(error){
    console.log('Error in protectRoute middleware', error.message)
    return res.status(500).json({message: 'Unauthorized - Invalid access token!'})
  }
}

export const adminRoute=(req, res, next)=>{
  if(req.user && req.user.role==='Admin'){
    next()
  }else{
    res.status(401).json({message: 'Acess denied - Admin only!'})
  }
}