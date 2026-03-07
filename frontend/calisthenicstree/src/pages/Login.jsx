import React from 'react';

const Login = () => {
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
          <p className="text-gray-400">pleas enter your details</p>
        </div>

        <form className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none"
            />
          </div>
          
          <div className="flex justify-end">
            <button type="button" className="text-xs text-gray-400 hover:text-white uppercase tracking-widest">Forgot password</button>
          </div>

          <button className="w-full bg-gray-200 text-black font-bold py-3 rounded-full hover:bg-white transition-all tracking-widest text-sm">
            LOGIN
          </button>
        </form>

        <div className="mt-12 text-center max-w-md border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400">
            Don't have an account? <button className="text-white font-bold ml-1 hover:underline">SIGN UP</button>
          </p>
        </div>
      </div>

      {/* Right Section: Image/Branding Placeholder */}
      <div className="hidden lg:flex w-1/2 bg-[#222] items-center justify-center relative overflow-hidden">
         <div className="text-[40rem] font-bold text-white opacity-10 leading-none select-none">C</div>
      </div>
    </div>
  );
};

export default Login;