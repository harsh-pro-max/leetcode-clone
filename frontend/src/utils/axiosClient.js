import axios from "axios";

// ✅ Dynamic Base URL: Production (VITE_API_URL) ya Localhost (fallback)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;