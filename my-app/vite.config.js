import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //start code
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:5000', //to avoid cors errors, add this little code
      }
    }
  }
  //end code
})
