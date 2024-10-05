import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
  name:{type:String, require:true},
  description:{type:String, require:true},
  price:{type:Number, min:0, require:true},
  image:{type:String, require:[true, 'Image is required']},
  category:{type:String, require:true},
  isFeatured:{type:Boolean, default:false}
},{timestamps:true})

const Product=mongoose.model('Product', productSchema)

export default Product