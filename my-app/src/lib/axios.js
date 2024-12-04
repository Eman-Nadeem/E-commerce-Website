import axios from 'axios'

const axiosInstance=axios.create({
  baseURL: import.meta.mode === 'development' ? 'http://localhost:5000/api' : '/api', //dynamic in development mode and static in production
  withCredentials: true, //send cookies on every request

})

export default axiosInstance