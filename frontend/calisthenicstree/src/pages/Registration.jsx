import React from 'react';

const Registration = () => {
  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Left Section: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#222] items-center justify-center relative overflow-hidden">
         <div className="text-[40rem] font-bold text-white opacity-10 leading-none select-none">C</div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24">
        <div className="flex items-center gap-2 mb-12 self-end lg:self-start">
            <span className="font-bold text-xl tracking-tight">Calisthenics Tree</span>
            <div className="w-8 h-8 border-4 border-white rounded-sm"></div>
        </div>

        <div className="mb-6">
          <h2 className="text-4xl font-semibold mb-2">Create account</h2>
          <p className="text-gray-400">pleas enter your details</p>
        </div>

        <form className="space-y-4 max-w-lg">
          <div className="flex gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-300">First name</label>
                <input type="text" placeholder="Enter your first name" className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none" />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-300">Last name</label>
                <input type="text" placeholder="Enter your last name" className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input type="email" placeholder="Enter your email" className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input type="password" placeholder="Enter your password" className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none" />
            <p className="text-[10px] text-gray-500 mt-1 uppercase">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
            <input type="password" placeholder="Re-enter password" className="w-full p-3 rounded-lg bg-gray-300 text-black placeholder-gray-500 outline-none" />
            <p className="text-[10px] text-red-500 mt-1 uppercase">Password do not match</p>
          </div>

          <button className="w-full bg-gray-200 text-black font-bold py-3 rounded-full hover:bg-white transition-all tracking-widest text-sm mt-4">
            SIGN UP
          </button>
        </form>

        <div className="mt-8 text-center max-w-lg border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-400 font-mono">
            Already have an account? <button className="text-white font-bold ml-1 hover:underline">LOGIN</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;