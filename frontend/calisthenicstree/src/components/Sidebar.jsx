import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiActivity, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/dashboard', icon: <FiHome size={24} /> }, 
        { path: '/profile', icon: <FiUser size={24} /> },   
        { path: '/activity', icon: <FiActivity size={24} /> }, 
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('completedExercises'); 
        navigate('/');
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-20 bg-[#E5E5E5] flex flex-col items-center py-8 z-50 shadow-lg border-r border-gray-300">
            
            {/* Logo Area */}
            <div className="mb-12 font-black text-3xl tracking-tighter text-black">
                C
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-6 flex-grow w-full px-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`flex justify-center items-center w-full aspect-square rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? 'bg-white shadow-md text-black scale-105' 
                                    : 'text-gray-500 hover:text-black hover:bg-gray-200'
                            }`}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Logout Button */}
            <div className="w-full px-3">
                <button 
                    onClick={handleLogout} 
                    title="Logout"
                    className="flex justify-center items-center w-full aspect-square rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-100 transition-all duration-200"
                >
                    <FiLogOut size={24} />
                </button>
            </div>

        </div>
    );
};

export default Sidebar;