import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema=new mongoose.Schema({
  name:{type:String, require:[true, 'Name is required.']}, 
  email:{type:String, require:[true, 'Email is required.'], 
    unique: true,
    lowercase: true, 
    trim: true
  }, 
  password:{type:String, require:[true, 'Password is required'],
    minlength:[6, 'Password must contain atleast 6 characters']
  },
  cartItems:[{
    quantity:{
      type:Number,
      default:1
    },
    product:{type:mongoose.Schema.Types.ObjectId, ref: 'Product'}
  }],
  role:{type:String, enum:['Customer', 'Admin'], default:'Customer'}
},{
  timestamps:true,
})

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  try{
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password, salt)
  }catch(error){
    next(error)
  }
})

userSchema.methods.comparePassword=async function(password) {
  return bcrypt.compare(password, this.password)  
}

const User=mongoose.model('user', userSchema)
export default User