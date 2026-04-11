import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080', // Your Spring Boot URL
});

// The Interceptor: Runs before EVERY request leaves your React app
api.interceptors.request.use(
    (config) => {
        // Grab the token from localStorage (where we saved it during login!)
        const token = localStorage.getItem('token');
        
        // If it exists, attach it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;