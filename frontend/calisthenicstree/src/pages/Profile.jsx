import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
    const [userProgress, setUserProgress] = useState(null);
    const [maxLevels, setMaxLevels] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProfileData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [progressRes, exercisesRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/user/progress', { headers }),
                axios.get('http://localhost:8080/api/v1/user/exercises', { headers })
            ]);

            const progressData = progressRes.data;
            const exercisesData = exercisesRes.data;

            const calculatedMaxLevels = exercisesData.reduce((acc, currentExercise) => {
                const cat = currentExercise.category;
                const level = currentExercise.progressionLevel;
                
                if (!acc[cat] || level > acc[cat]) {
                    acc[cat] = level;
                }
                return acc;
            }, {});

            setUserProgress(progressData);
            setMaxLevels(calculatedMaxLevels);
            setLoading(false);
            
        } catch (error) {
            console.error("Failed to load profile data", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex items-center justify-center">Loading Stats...</div>;
    }

    // 1. Calculate Total Level (XP equivalent)
    const pushLevel = userProgress?.Push || 0;
    const pullLevel = userProgress?.Pull || 0;
    const legsLevel = userProgress?.Legs || 0;
    const coreLevel = userProgress?.Core || 0; 
    
    // 2. Format Data for the Radar Chart
    // The 'fullMark' is the max level possible for that category.
    const radarData = Object.keys(maxLevels).map(category => {
        return {
            subject: category.toUpperCase(),
            A: userProgress[category] || 0,
            fullMark: maxLevels[category]
        };
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">PROFILE</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Stat Grid */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-2">Category Mastery</h2>

                    {radarData.map((data, index) => {
                        const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                        const colorClass = colors[index % colors.length];

                        return (
                            <StatCard 
                                key={data.subject}
                                title={data.subject} 
                                level={data.A} 
                                maxLevel={data.fullMark}
                                color={colorClass} 
                            />
                        );
                    })}
                </div>

                {/* Right Column: Radar Chart */}
                <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                    <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest w-full text-left mb-4">Attribute Spread</h2>
                    
                    <div className="w-full h-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 14, fontWeight: 'bold' }} />
                                {/* Hide the radius axis to keep the spider web clean */}
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                
                                <Radar
                                    name="Player Stats"
                                    dataKey="A"
                                    stroke="#ef4444" // Tailwind red-500
                                    strokeWidth={3}
                                    fill="#ef4444"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ title, level, maxLevel, color }) => {
    const percentage = maxLevel > 0 ? Math.min((level / maxLevel) * 100, 100) : 0; 

    return (
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg tracking-widest">{title}</span>
                <span className="text-2xl font-black font-mono text-gray-400">Lv.{level}</span>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-gray-800">
                <div 
                    className={`h-full ${color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default Profile;