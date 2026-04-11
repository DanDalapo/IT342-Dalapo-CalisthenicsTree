import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillTree from '../components/SkillTree';

const Dashboard = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTreeData = async () => {
            try {
                const token = localStorage.getItem('token');
                // Call the new User endpoint we just made!
                const response = await axios.get('http://localhost:8080/api/v1/user/exercises', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setExercises(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load tree data", error);
            }
        };

        fetchTreeData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Your Progression Tree</h1>
            
            {loading ? (
                <p>Loading your skill tree...</p>
            ) : (
                <SkillTree exercises={exercises} />
            )}
        </div>
    );
};

export default Dashboard;