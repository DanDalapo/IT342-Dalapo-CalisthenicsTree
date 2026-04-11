import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [exercise, setExercise] = useState({
        name: '',
        category: '',
        progressionLevel: 0,
        prerequisiteId: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            
            const payload = {
                name: exercise.name,
                category: exercise.category,
                progressionLevel: exercise.progressionLevel,
                prerequisiteId: exercise.prerequisiteId ? parseInt(exercise.prerequisiteId) : null
            };

            console.log("Sending payload to Spring Boot:", payload);

            await axios.post('http://localhost:8080/api/v1/admin/exercises', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setMessage(`✅ Successfully added: ${exercise.name}!`);
            setExercise({ name: '', category: '', progressionLevel: 0, prerequisiteId: '' });
            
        } catch (error) {
            // Let's print the REAL error to the browser console so we aren't guessing!
            console.error("Actual Server Error:", error.response?.data || error.message);
            setMessage("❌ Failed to add exercise. Check Browser Console (F12) or Spring Boot Terminal.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold text-red-500 tracking-tight">Admin Control Panel</h1>
                    <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">LOGOUT</button>
                </div>
                
                <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Add New Progression Exercise</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                            <input 
                                type="text" 
                                value={exercise.category}
                                onChange={(e) => setExercise({...exercise, category: e.target.value})}
                                placeholder="e.g., Push-ups, Squats, Pull-ups"
                                className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Exercise Name</label>
                            <input 
                                type="text" 
                                value={exercise.name}
                                onChange={(e) => setExercise({...exercise, name: e.target.value})}
                                placeholder="e.g., Diamond Push-up"
                                className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Progression Level</label>
                            <input 
                                type="number" 
                                value={exercise.progressionLevel}
                                onChange={(e) => setExercise({...exercise, progressionLevel: parseInt(e.target.value)})}
                                className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none transition-colors"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">
                                Prerequisite Exercise ID (Optional)
                            </label>
                            <input 
                                type="number" 
                                value={exercise.prerequisiteId}
                                onChange={(e) => setExercise({...exercise, prerequisiteId: e.target.value})}
                                placeholder="Leave blank if this is a starting exercise"
                                className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none transition-colors"
                            />
                        </div>

                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-500 transition-all tracking-widest text-sm mt-4">
                            ADD EXERCISE TO DATABASE
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded bg-black border ${message.includes('✅') ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;