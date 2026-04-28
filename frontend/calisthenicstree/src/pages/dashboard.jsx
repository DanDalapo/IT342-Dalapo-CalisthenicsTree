import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SkillTree from '../components/SkillTree';

const Dashboard = () => {
    const [exercises, setExercises] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [ratingModal, setRatingModal] = useState({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null });
    const [selectedDifficulty, setSelectedDifficulty] = useState(5);
    const [revertModal, setRevertModal] = useState({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null });
    
    const [completedExercises, setCompletedExercises] = useState(() => {
        const saved = localStorage.getItem('completedExercises');
        return saved ? JSON.parse(saved) : [];
    });

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

    // 1. This just opens the modal when a node is clicked
    const handleCompleteExercise = (exerciseId, exerciseName, category, exerciseLevel) => {
        setRatingModal({ isOpen: true, exerciseId, exerciseName, category, exerciseLevel });
        setSelectedDifficulty(5); // Reset slider to the middle
    };

    // 2. THIS is the gatekeeper that runs when they click "Submit" on the modal
    const handleRatingSubmit = async () => {
        const { exerciseId, exerciseName, category, exerciseLevel } = ratingModal;
        const rating = selectedDifficulty;

        if (rating <= 7) {
            setUserProgress(prev => ({ ...prev, [category]: Math.max(prev[category] || 0, exerciseLevel + 1) }));

            const newCompleted = [...completedExercises, exerciseId];
            setCompletedExercises(newCompleted);
            localStorage.setItem('completedExercises', JSON.stringify(newCompleted));

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://localhost:8080/api/v1/user/progress/complete/${exerciseId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setToast({ message: `${response.data}`, type: 'success' }); 
                setTimeout(() => setToast({ message: '', type: '' }), 5000);
            } catch (error) {
                setUserProgress(prev => ({ ...prev, [category]: exerciseLevel }));
                const serverMsg = typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message;
                alert(`Error: ${serverMsg || error.message}`);
            }
        } else {
            setToast({ message: `Keep practicing! A rating of ${rating} means you need more time to master ${exerciseName}.`, type: 'warning' });
            setTimeout(() => setToast({ message: '', type: '' }), 5000);
        }

        setRatingModal({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null });
    };

    const handleRevertExercise = (exerciseId, exerciseName, category, exerciseLevel) => {
        setRevertModal({ isOpen: true, exerciseId, exerciseName, category, exerciseLevel });
    };

    const confirmRevertExercise = async () => {
        const { exerciseId, exerciseName, category, exerciseLevel } = revertModal;
        
        setRevertModal({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null });

        const previousLevel = userProgress[category];

        const newCompleted = completedExercises.filter(id => id !== exerciseId);
        setCompletedExercises(newCompleted);
        localStorage.setItem('completedExercises', JSON.stringify(newCompleted));

        const remainingInCategory = exercises.filter(ex => 
            ex.category === category && newCompleted.includes(ex.id)
        );

        let newCategoryLevel = 0;
        if (remainingInCategory.length > 0) {
            const highestLevelDone = Math.max(...remainingInCategory.map(ex => ex.progressionLevel));
            newCategoryLevel = highestLevelDone + 1;
        }

        setUserProgress(prev => ({ ...prev, [category]: newCategoryLevel }));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8080/api/v1/user/progress/revert/${exerciseId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ message: ` ${response.data}`, type: 'warning' }); 
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
                    completedExercises={completedExercises}
                    onComplete={handleCompleteExercise} 
                    onRevert={handleRevertExercise} 
                />
            )}

            {ratingModal.isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-[#111] border border-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <h2 className="text-2xl font-bold text-red-500 mb-2">Workout Complete!</h2>
                        <p className="text-gray-400 mb-6">
                            How difficult was <span className="font-bold text-white">{ratingModal.exerciseName}</span>?
                        </p>
                        
                        <div className="text-5xl font-mono font-bold text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                            {selectedDifficulty} <span className="text-2xl text-gray-600">/ 10</span>
                        </div>
                        
                        <input 
                            type="range" min="1" max="10" 
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(parseInt(e.target.value))}
                            className="w-full accent-red-500 mb-2 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                        
                        <div className="flex justify-between text-xs font-bold text-gray-500 tracking-widest mb-8">
                            <span>1 - EFFORTLESS</span>
                            <span>10 - IMPOSSIBLE</span>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setRatingModal({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null })}
                                className="flex-1 py-3 rounded-lg bg-gray-900 text-gray-400 hover:text-white transition-colors font-bold"
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={handleRatingSubmit}
                                className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all font-bold tracking-widest"
                            >
                                SUBMIT LOG
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {revertModal.isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">
                            REVERT TARGET
                        </h2>
                        
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            Do you want to step back and make <span className="text-white font-bold">{revertModal.exerciseName}</span> your current target again? 
                            You may lose access to higher-level unlocks in this path if no other prerequisites are met.
                        </p>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setRevertModal({ isOpen: false, exerciseId: null, exerciseName: '', category: '', exerciseLevel: null })}
                                className="flex-1 py-3 rounded-lg bg-gray-900 text-gray-400 hover:text-white transition-colors font-bold"
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={confirmRevertExercise}
                                className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all font-bold tracking-widest"
                            >
                                CONFIRM REVERT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;