import axios from "axios";

// Create axios instance with base URL
const axiosInstance = axios.create({
    baseURL: "https://batu-hospital-patient-appointment-system.onrender.com/api",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
    
});


export default axiosInstance;
