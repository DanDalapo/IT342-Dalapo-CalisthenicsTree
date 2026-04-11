import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Import our custom VIP Axios!

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // The Progression Data (We will move this to the database later!)
    const progressionTree = [
        {
            category: "Push-ups",
            color: "text-blue-400",
            bg: "bg-blue-900/20",
            border: "border-blue-500/30",
            skills: ["Wall Push-up", "Knee Push-up", "Standard Push-up"]
        },
        {
            category: "Squats",
            color: "text-emerald-400",
            bg: "bg-emerald-900/20",
            border: "border-emerald-500/30",
            skills: ["Assisted Squat", "Half Squat", "Standard Squat"]
        },
        {
            category: "Pull-ups",
            color: "text-purple-400",
            bg: "bg-purple-900/20",
            border: "border-purple-500/30",
            skills: ["Active Hang", "Negative Pull-up", "Standard Pull-up"]
        }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Notice we don't need to attach the token here manually! 
                // The interceptor does it for us.
                const response = await api.get('/api/v1/user/profile');
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                // If the token is expired/invalid, clear it and kick them out
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!userData) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold">Calisthenics Tree</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {userData.email}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-500 border border-red-500/50 px-6 py-2 rounded font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                    LOGOUT
                </button>
            </div>

            {/* Progression Tree Area */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-gray-200">Fundamental Progression</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {progressionTree.map((track, index) => (
                        <div key={index} className={`p-6 rounded-xl border ${track.border} ${track.bg}`}>
                            <h3 className={`text-xl font-bold mb-6 uppercase tracking-wider ${track.color}`}>
                                {track.category}
                            </h3>
                            
                            {/* The Branches */}
                            <div className="space-y-4 relative">
                                {/* Vertical line connecting the tree */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-700 z-0"></div>

                                {track.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="relative z-10 flex items-center group cursor-pointer">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-600 bg-black text-xs font-bold mr-4 group-hover:border-white transition-colors`}>
                                            {skillIndex + 1}
                                        </div>
                                        <div className="bg-gray-900 border border-gray-800 p-4 rounded flex-1 group-hover:border-gray-600 transition-colors">
                                            <p className="font-semibold text-gray-200">{skill}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;