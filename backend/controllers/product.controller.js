import Product from "../models/product.model.js"
import { redis } from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllProducts=()=>{
  try{
    const products=Product.find({})
    res.json({products})
  }catch(error){
    console.log('Error in getAllProducts controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const getFeaturedProducts=async(req, res)=>{
  try{
    let featuredProducts=await redis.get('featured_products')

    if(featuredProducts){
      return res.json(JSON.parse(featuredProducts))
    }

    featuredProducts=await Product.find({isFeatured: true}).lean()

    if(!featuredProducts){
      return res.status(404).json({message: 'No featured products found...'})
    }

    await redis.set('featured_products', JSON.stringify(featuredProducts))
    res.json(featuredProducts)
  }catch(error){
    console.log('Error in getFeaturedProducts controller', error.message);
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const createProducts=async(req, res)=>{
  try{
    const {name, description, price, category, image}=req.body

    let cloudinaryResponse=''

    if(image){
      cloudinaryResponse=await cloudinary.uploader.upload(image, {folder: 'Products'})
    }

    const product=await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category
    })

    res.status(201).json(product)
  }catch(error){
    console.log('Error in createProducts controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const deleteProducts=async(req, res)=>{
  try{
    const product=await Product.findById(req.params.id)

    if(!product){
      return res.status(404).json({message: 'Product not found'})
    }

    if(product.image){
      const publicId=product.image.split('/').pop().split('.')[0]
      
      try {
        await cloudinary.uploader.destroy(`Products/${publicId}`)
        console.log('Deleted image from cloudinary')
      }catch(error){
        console.log('Error deleting image from cloudinary', error.message)
      }

      await Product.findByIdAndDelete(req.params.id)
      res.json({message: 'Products deleted successfully'})
    }
  }catch(error){
    console.log('Error in deleteProducts controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}