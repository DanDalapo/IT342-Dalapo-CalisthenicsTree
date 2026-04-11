import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Updated URL to match Spring Boot v1 standard
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                email: formData.email,
                password: formData.password
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);

            setMessage('');
            setSuccessMessage('Login successful! Redirecting...');

            setTimeout(() => {
                navigate('/dashboard'); 
            }, 1500); 

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || "Invalid email or password");
            } else {
                setMessage("Server error. Is the backend running?");
            }
        }
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans">
            {/* Left Section: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24">
                <div className="flex items-center gap-2 mb-16">
                    <div className="w-8 h-8 border-4 border-white rounded-sm"></div>
                    <span className="font-bold text-xl tracking-tight">Calisthenics Tree</span>
                </div>

                <div className="mb-8">
                    <h2 className="text-4xl font-semibold mb-2">Welcome back</h2>
                    <p className="text-gray-400">please enter your details</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                        <div className="relative flex items-center">
                            {/* Replace with <img src={mailIcon} /> when ready */}
                            <span className="absolute left-3 text-black">@</span> 
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                        <div className="relative flex items-center">
                            {/* Replace with <img src={lockIcon} /> when ready */}
                            <span className="absolute left-3 text-black">#</span>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    
                    {message && (
                        <p className="text-red-500 text-xs uppercase font-bold tracking-widest">{message}</p>
                    )}

                    {successMessage && (
                        <p className="text-green-500 text-xs uppercase font-bold tracking-widest">{successMessage}</p>
                    )}

                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                            Forgot password
                        </button>
                    </div>

                    

                    <button 
                        type="submit"
                        className="w-full bg-gray-200 text-black font-bold py-3 rounded-full hover:bg-white transition-all tracking-widest text-sm"
                    >
                        LOGIN
                    </button>

                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-gray-400 text-sm mb-4">Or continue with</p>
                        
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const response = await axios.post('http://localhost:8080/api/v1/auth/google/login', {
                                        token: credentialResponse.credential
                                    });
                                    
                                    // If successful, handle it just like a normal manual login!
                                    setSuccessMessage('Google Login successful! Redirecting...');
                                    
                                    localStorage.setItem('token', response.data.token);
                                    localStorage.setItem('role', response.data.role);

                                    setTimeout(() => {
                                        navigate('/dashboard'); 
                                    }, 2000);
                                    
                                } catch (error) {
                                    setMessage("Google authentication failed on our server.");
                                }
                            }}
                            onError={() => {
                                console.log('Google Login Failed');
                            }}
                            theme="filled_black"
                            shape="pill"
                        />
                    </div>
                </form>

                <div className="mt-12 text-center max-w-md border-t border-gray-800 pt-8">
                    <p className="text-sm text-gray-400">
                        Don't have an account? 
                        <Link to="/signup" className="text-white font-bold ml-1 hover:underline">SIGN UP</Link>
                    </p>
                </div>
            </div>

            {/* Right Section: Branding Placeholder */}
            <div className="hidden lg:flex w-1/2 bg-[#111] items-center justify-center relative overflow-hidden">
                <div className="text-[40rem] font-bold text-white opacity-5 leading-none select-none">C</div>
            </div>
        </div>
    );
};

export default Login;