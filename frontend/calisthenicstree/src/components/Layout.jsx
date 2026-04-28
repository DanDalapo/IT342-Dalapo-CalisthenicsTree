import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* The Sidebar is fixed on the left */}
            <Sidebar />
            
            {/* Because the Sidebar is 'fixed' and w-20 (5rem/80px wide), 
              we add a left margin of ml-20 to the main content area 
              so it doesn't hide underneath the sidebar! 
            */}
            <div className="ml-20 flex-grow w-full relative">
                {children}
            </div>
        </div>
    );
};

export default Layout;