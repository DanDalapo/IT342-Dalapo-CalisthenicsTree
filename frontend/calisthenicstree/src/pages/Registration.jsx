import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Registration = () => {
  const navigate = useNavigate();

  // 1. Setup State for all form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fitnessLevel: 'Beginner'
  });

  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Handle typing in the inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic password validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Sending data to your Spring Boot backend
      await axios.post('http://localhost:8080/api/v1/auth/register', {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          fitnessLevel: formData.fitnessLevel // Make sure this line is here!
      });

      setMessage('');
      setSuccessMessage('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Registration failed. Try again.");
      } else {
        setMessage("Server error. Is the backend running?");
      }
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Left Section: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#111] items-center justify-center relative overflow-hidden">
         <div className="text-[40rem] font-bold text-white opacity-5 leading-none select-none">C</div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24">
        <div className="flex items-center gap-2 mb-12 self-end lg:self-start">
            <span className="font-bold text-xl tracking-tight">Calisthenics Tree</span>
            <div className="w-8 h-8 border-4 border-white rounded-sm"></div>
        </div>

        <div className="mb-6">
          <h2 className="text-4xl font-semibold mb-2">Create account</h2>
          <p className="text-gray-400">please enter your details</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 max-w-lg">
          <div className="flex gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-300">First name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name" 
                  className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white" 
                  required
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-300">Last name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name" 
                  className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white" 
                  required
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password" 
              className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Fitness Level</label>
            <select 
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-300 text-black outline-none focus:ring-2 focus:ring-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Error Message Display (Red) */}
          {message && <p className="text-red-500 text-xs uppercase font-bold tracking-widest mt-2">{message}</p>}

          {/* Success Message Display (Green) */}
          {successMessage && <p className="text-green-500 text-xs uppercase font-bold tracking-widest mt-2">{successMessage}</p>}

          <button 
            type="submit"
            className="w-full bg-gray-200 text-black font-bold py-3 rounded-full hover:bg-white transition-all tracking-widest text-sm mt-6"
          >
            SIGN UP
          </button>

          <div className="mt-6 flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-4">Or continue with</p>
                        
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await axios.post('http://localhost:8080/api/v1/auth/google/register', {
                      token: credentialResponse.credential
                    });
                                    
                    // If successful, handle it just like a normal manual login!
                    setMessage(''); // Clear any old errors
                    setSuccessMessage('Google Signup successful! Redirecting...');
                                    
                    // TODO: Save response.data.token to localStorage here if you need to!

                    setTimeout(() => {
                      navigate('/dashboard'); // Or wherever your app goes after login
                    }, 2000);
                                    
                  } catch (error) {
                    // THE FIX: Unmask the true Spring Boot error message!
                    if (error.response && error.response.data) {
                        setMessage(error.response.data); // This will show "Account already exists."
                    } else {
                        setMessage("Cannot connect to the backend server.");
                    }
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

        <div className="mt-8 text-center max-w-lg border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-400 font-mono">
            Already have an account? 
            {/* HERE IS THE FIX! React Router Link back to the home/login route */}
            <Link to="/" className="text-white font-bold ml-1 hover:underline">LOGIN</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;