import {redis} from '../lib/redis.js'
import JWT from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (userId) => {
  const accessToken = JWT.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = JWT.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken=async(userId, refreshToken)=>{
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7*24*60*60) //7 Days
}

const setCookies=(res, accessToken, refreshToken)=>{
  res.cookie('accessToken', accessToken, {
    httpOnly: true, //prevents XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', //prevents CSRF attack, cross-site request forgery attack
    maxAge: 15*60*1000 //15 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7*24*60*60*1000 //7 days
  });
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This email already exists." });
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (error) {
    console.log('Error in signup controller', error.message)
    res.status(500).json({ message: error.message });
  }
};

export const logout=async(req, res)=>{
  try{
    const refreshToken=req.cookies.refreshToken

    if(refreshToken){
      const decoded=JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      await redis.del(`refresh_token:${decoded.userId}`)
    }
    res.clearCookie('access-token')
    res.clearCookie('refresh-token')
    res.json({message: 'Logged out successfully'})
  }catch(error){
    console.log('Error in logout controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const login=async(req, res)=>{
  try{
    const {email, password}=req.body
    const user=await User.findOne({email})
    
    if(user && (await user.comparePassword(password))){
      const {accessToken, refreshToken}=generateToken(user._id)
      await storeRefreshToken(user._id, refreshToken)
      setCookies(res, accessToken, refreshToken)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }else{
      return res.status(400).json({message: 'Invalid credentials'})
    }
  }catch(error){
    console.log('Error in login controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const refreshToken=async(req, res)=>{
  try{
    const refreshToken=req.cookies.refreshToken
    console.log(refreshToken)
    if(!refreshToken){
      return res.status(401).json({message: 'No refresh token provided'})
    }
    const decoded=JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken=await redis.get(`refresh_token:${decoded.userId}`)

    if(storedToken !== refreshToken){
      return res.status(401).json({message: 'Invalid refresh token'})
    }
    const accessToken=JWT.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 15*60*1000
    })
    
    res.json({message: 'Token refreshed successfully'})
  }catch(error){
    console.log('Error in refreshToken controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

// TODO getProfile function 
