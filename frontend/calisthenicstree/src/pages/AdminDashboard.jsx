import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const [exercise, setExercise] = useState({ name: '', category: '', progressionLevel: 0, prerequisiteIds: '' });
    const [message, setMessage] = useState('');
    const [exercisesList, setExercisesList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 10;

    const fetchExercises = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/v1/admin/exercises', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setExercisesList(response.data);
        } catch (error) {
            console.error("Failed to fetch exercises", error);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem('token');

        let parsedPrerequisites = [];
        if (exercise.prerequisiteIds) {
            parsedPrerequisites = String(exercise.prerequisiteIds)
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
        }

        const payload = {
            name: exercise.name,
            category: exercise.category,
            progressionLevel: exercise.progressionLevel,
            prerequisiteIds: parsedPrerequisites
        };

        const previousExercisesList = [...exercisesList];
        const tempId = `temp-${Date.now()}`;
        const currentEditingId = editingId;

        if (currentEditingId) {
            setExercisesList(prev => prev.map(ex => ex.id === currentEditingId ? { ...payload, id: currentEditingId } : ex));
        } else {
            setExercisesList(prev => [...prev, { ...payload, id: tempId }]);
        }

        setExercise({ name: '', category: '', progressionLevel: 0, prerequisiteIds: '' });
        setEditingId(null);
        setShowNewCategoryInput(false);

        try {
            if (currentEditingId) {
                await axios.put(`http://localhost:8080/api/v1/admin/exercises/${currentEditingId}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMessage(`Successfully updated: ${payload.name}!`);
            } else {
                const response = await axios.post('http://localhost:8080/api/v1/admin/exercises', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setExercisesList(prev => prev.map(ex => ex.id === tempId ? response.data : ex));
                setMessage(`Successfully added: ${payload.name}!`);
            }
            

        } catch (error) {
            setExercisesList(previousExercisesList); 
            setExercise(payload);
            setEditingId(currentEditingId);
            console.error("Server Error:", error.response?.data || error.message);
            setMessage("Failed to save exercise. Connection lost or rejected.");
        }
    };

    const handleEditClick = (ex) => {
        setEditingId(ex.id);
        setExercise({
            name: ex.name,
            category: ex.category,
            progressionLevel: ex.progressionLevel,
            // Convert the array [1, 2] back to a string "1, 2" for the input box
            prerequisiteIds: ex.prerequisiteIds && ex.prerequisiteIds.length > 0 ? ex.prerequisiteIds.join(', ') : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setExercise({ name: '', category: '', progressionLevel: 0, prerequisiteIds: '' });
        setShowNewCategoryInput(false);
        setMessage('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const baseCategories = ['Push', 'Pull', 'Legs']; 
    const dbCategories = exercisesList.map(ex => ex.category); 
    const availableCategories = [...new Set([...baseCategories, ...dbCategories])];

    const filteredExercises = exercisesList.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || ex.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold text-red-500 tracking-tight">Admin Control Panel</h1>
                    <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">LOGOUT</button>
                </div>
                
                <div className={`p-8 rounded-xl border transition-all duration-300 ${editingId ? 'bg-gray-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#111] border-gray-800'}`}>
                    <h2 className="text-xl font-bold mb-6 flex justify-between">
                        {editingId ? `Editing: ${exercise.name} (ID: ${editingId})` : 'Add New Progression Exercise'}
                        {editingId && <button onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-red-400">Cancel Edit</button>}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                                {!showNewCategoryInput ? (
                                    <select 
                                        value={exercise.category}
                                        onChange={(e) => {
                                            if (e.target.value === 'ADD_NEW') {
                                                setShowNewCategoryInput(true);
                                                setExercise({ ...exercise, category: '' });
                                            } else {
                                                setExercise({ ...exercise, category: e.target.value });
                                            }
                                        }}
                                        className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {availableCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="ADD_NEW" className="text-red-400 font-bold">➕ Add New Category...</option>
                                    </select>
                                ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={exercise.category}
                                            onChange={(e) => setExercise({...exercise, category: e.target.value})}
                                            placeholder="Type new category..."
                                            className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none"
                                            required autoFocus
                                        />
                                        <button type="button" onClick={() => { setShowNewCategoryInput(false); setExercise({...exercise, category: ''}); }} className="px-4 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors">✕</button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Exercise Name</label>
                                <input type="text" value={exercise.name} onChange={(e) => setExercise({...exercise, name: e.target.value})} className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Progression Level</label>
                                <input type="number" value={exercise.progressionLevel} onChange={(e) => setExercise({...exercise, progressionLevel: parseInt(e.target.value)})} className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none" min="0" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Prerequisite IDs (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={exercise.prerequisiteIds} 
                                    onChange={(e) => setExercise({...exercise, prerequisiteIds: e.target.value})} 
                                    placeholder="e.g. 1, 2"
                                    className="w-full p-3 bg-black rounded-lg border border-gray-700 focus:border-red-500 outline-none" 
                                />
                            </div>
                        </div>

                        <button type="submit" className={`w-full font-bold py-4 rounded-lg transition-all tracking-widest text-sm mt-4 ${editingId ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                            {editingId ? 'UPDATE EXERCISE' : 'ADD EXERCISE TO DATABASE'}
                        </button>
                    </form>

                    {message && <div className="mt-6 p-4 rounded bg-black border border-gray-700 text-center">{message}</div>}
                </div>

                <div className="mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                        <h2 className="text-xl font-bold">Current Database Exercises</h2>
                        
                        <div className="flex gap-4 w-full md:w-auto">
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-3 bg-[#111] rounded-lg border border-gray-800 focus:border-red-500 outline-none w-full md:w-64 transition-colors"
                            />
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="p-3 bg-[#111] rounded-lg border border-gray-800 focus:border-red-500 outline-none w-full md:w-48 appearance-none"
                            >
                                <option value="">All Categories</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                        <table className="w-full text-left">
                            <thead className="bg-black border-b border-gray-800">
                                <tr>
                                    <th className="p-4 text-gray-400">ID</th>
                                    <th className="p-4 text-gray-400">Name</th>
                                    <th className="p-4 text-gray-400">Category</th>
                                    <th className="p-4 text-gray-400">Level</th>
                                    <th className="p-4 text-gray-400">Pre-Req</th>
                                    <th className="p-4 text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentExercises.map((ex) => (
                                    <tr key={ex.id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                                        <td className="p-4 text-red-500 font-mono">{ex.id}</td>
                                        <td className="p-4 font-bold">{ex.name}</td>
                                        <td className="p-4 text-gray-400">{ex.category}</td>
                                        <td className="p-4 text-gray-400">{ex.progressionLevel}</td>
                                        <td className="p-4 text-gray-500 font-mono">
                                            {ex.prerequisiteIds && ex.prerequisiteIds.length > 0 
                                                ? ex.prerequisiteIds.join(', ') 
                                                : 'None'}
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleEditClick(ex)}
                                                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-bold text-white transition-colors"
                                            >
                                                EDIT
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredExercises.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No exercises found matching your search.
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 bg-black border-t border-gray-800">
                                <span className="text-sm text-gray-500">
                                    Showing {indexOfFirstExercise + 1} to {Math.min(indexOfLastExercise, filteredExercises.length)} of {filteredExercises.length}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded bg-gray-900 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        &larr; Prev
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded flex items-center justify-center font-bold transition-colors ${
                                                currentPage === i + 1 
                                                ? 'bg-red-600 text-white' 
                                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded bg-gray-900 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;