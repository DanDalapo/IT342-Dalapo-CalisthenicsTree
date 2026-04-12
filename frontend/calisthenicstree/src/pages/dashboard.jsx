import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SkillTree from '../components/SkillTree';

const Dashboard = () => {
    const [exercises, setExercises] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });

    const fetchDashboardData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [exercisesRes, progressRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/user/exercises', { headers }),
                axios.get('http://localhost:8080/api/v1/user/progress', { headers })
            ]);
            
            setExercises(exercisesRes.data);
            setUserProgress(progressRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCompleteExercise = async (exerciseId, exerciseName, category, exerciseLevel) => {
        if (!window.confirm(`Are you sure you mastered: ${exerciseName}?`)) return;

        setUserProgress(prev => ({
            ...prev,
            [category]: exerciseLevel + 1
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8080/api/v1/user/progress/complete/${exerciseId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ message: `🎉 ${response.data}`, type: 'success' }); 
            setTimeout(() => setToast({ message: '', type: '' }), 5000);
        } catch (error) {
            setUserProgress(prev => ({ ...prev, [category]: exerciseLevel }));
            console.error("COMPLETE ERROR FULL:", error);
            const serverMsg = typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message;
            alert(`Error: ${serverMsg || error.message}`);
        }
    };

    const handleRevertExercise = async (exerciseId, exerciseName, category, exerciseLevel) => {
        if (!window.confirm(`Do you want to step back and make ${exerciseName} your current target again? (You will lose higher-level unlocks in this path)`)) return;

        const previousLevel = userProgress[category];

        setUserProgress(prev => ({
            ...prev,
            [category]: exerciseLevel
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8080/api/v1/user/progress/revert/${exerciseId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ message: `🔄 ${response.data}`, type: 'warning' }); 
            setTimeout(() => setToast({ message: '', type: '' }), 5000);
        } catch (error) {
            setUserProgress(prev => ({ ...prev, [category]: previousLevel }));
            console.error("REVERT ERROR FULL:", error);
            const serverMsg = typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message;
            alert(`Error: ${serverMsg || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 relative">
            
            {toast.message && (
                <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-full font-bold z-50 animate-bounce text-white shadow-lg ${
                    toast.type === 'success' 
                        ? 'bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                        : 'bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]'
                }`}>
                    {toast.message}
                </div>
            )}

            <h1 className="text-3xl font-bold mb-8 text-red-500 tracking-widest">YOUR SKILL TREE</h1>
            
            {loading ? (
                <div className="text-gray-500 animate-pulse">Loading your progression...</div>
            ) : (
                <SkillTree 
                    exercises={exercises} 
                    userProgress={userProgress} 
                    onComplete={handleCompleteExercise} 
                    onRevert={handleRevertExercise} 
                />
            )}
        </div>
    );
};

export default Dashboard;