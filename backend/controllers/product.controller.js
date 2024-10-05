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

export const getRecommendedProducts=async(req, res)=>{
  try{
    const products=await Product.aggregate([
      {$sample: {size: 3}},
      {$project: {_id:1,
        name:1,
        description:1,
        image:1,
        price:1,
      }}
    ])

    res.json({products})
  }catch(error){
    console.log('Error in getRecommendedProducts controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const getProductsByCategory=async(req, res)=>{
  const category=req.params
  try{
    const products=await Product.find({category})
    res.json(products)
  }catch(error){
    console.log('Error in getProductsByCategory controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const toggleFeaturedProduct=async(req, res)=>{
  try{
    const product=await Product.findById(req.params.id)
    if(product){
      product.isFeatured=!product.isFeatured
      const updatedProduct=await Product.save()
      await updateFeaturedProductCache()
      res.json(updatedProduct)
    }else{
      res.status(404).json({message: 'Product not found!'})
    }
  }catch(error){
    console.log('Error in the toggleFeaturedProduct', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

async function updateFeaturedProductCache(){
  try {
    const featuredProducts=await Product.find({isFeatured: true}).lean()

    await redis.set(Featured_Products, JSON.stringify(featuredProducts))
  }catch(error){
    console.log('Error in updateFeaturedProductCache function', error.message)
  }
}