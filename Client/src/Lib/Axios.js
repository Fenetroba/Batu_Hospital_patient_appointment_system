import axios from "axios";

// Create axios instance with base URL
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials:true,
    
});


export default axiosInstance;
