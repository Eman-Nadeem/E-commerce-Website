import {create} from "zustand"

import axios from '../lib/axios.js'
import {toast} from 'react-hot-toast'

const useUserStore=create((set, get)=>({
  user: null,  //set to null initially
  loading: false,
  checkingAuth: true,

  signup: async(name, email, password, confirmPassword)=>{
    set({loading: true}) //once user clicks the signup button loading starts

    if(password!==confirmPassword){ //check if the two passwords typed match
      set({loading: false})
      return toast.error('Passwords do not match!') //give notification if they don't match
    }//call toaster in app.jsx

    try{
      const res=await axios.post('/auth/signup', {name, email, password}) //if they do then send the input from the from end to backend to this path
      set({user: res.data.user, loading: false}) //backend responds the res is set to the user and loading set to false
    }catch(error){
      set({loading: false}) //if there is an error loading set to false
      toast.error(error.response.data.message || 'An error occurred') //display the error message from the backend or a generic error message
    }
  },

  login: async(email, password)=>{
    set({loading: true}) //once user clicks the signup button loading starts

    try{
      const res=await axios.post('/auth/login', {email, password}) //if they do then send the input from the from end to backend to this path
      set({user: res.data, loading: false}) //backend responds the res is set to the user which was null initially and loading set to false
    }catch(error){
      set({loading: false}) //if there is an error loading set to false
      toast.error(error.response.data.message || 'An error occurred') //display the error message from the backend or a generic error message
    }
  },

  logout: async()=>{
    try{
      await axios.post("/auth/logout")
      set({user: null})
    }catch(error){
      toast.error(error.response?.data?.message || "An error occured during Logout, Try again!")
    }
  },

  //when you refresh the page the authentication should be checked based on that login or homepage is displayed after loading
  checkAuth: async()=>{
    set({checkingAuth: true})
    try{
      const response= await axios.get("/auth/profile") //returns user profile to us
      set({user: response.data, checkingAuth: false})
    }catch(error){
      set({checkingAuth: false, user: null})
    }
  }
}))

export default useUserStore

//TODO implement the axios intercepters for refreshing the access tokens, expires in 15min 