import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const SkillTree = ({ exercises }) => {

    // 1. Convert your Database Exercises into React Flow "Nodes"
    const nodes = useMemo(() => {
        return exercises.map((ex) => {
            // Auto-calculate X position based on Category (Columns)
            let xPos = 0;
            if (ex.category === 'Push-ups') xPos = 100;
            if (ex.category === 'Squats') xPos = 400;
            if (ex.category === 'Pull-ups') xPos = 700;

            // Auto-calculate Y position based on Level (Rows)
            let yPos = (ex.progressionLevel * 150) + 100;

            return {
                id: ex.id.toString(),
                position: { x: xPos, y: yPos },
                data: { label: `${ex.name} (Lvl ${ex.progressionLevel})` },
                style: {
                    background: '#111',
                    color: 'white',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    padding: '10px',
                    width: 150,
                    textAlign: 'center'
                }
            };
        });
    }, [exercises]);

    // 2. Convert your Database Prerequisites into React Flow "Edges" (Connecting Lines)
    const edges = useMemo(() => {
        return exercises
            .filter(ex => ex.prerequisiteId !== null) // Only grab exercises that have a parent
            .map(ex => ({
                id: `e${ex.prerequisiteId}-${ex.id}`,
                source: ex.prerequisiteId.toString(), // The line starts at the prerequisite...
                target: ex.id.toString(),             // ...and ends at the current exercise
                animated: true, // This makes the line move like a video game!
                style: { stroke: '#ef4444', strokeWidth: 2 } // Red connecting lines
            }));
    }, [exercises]);

    return (
        <div style={{ width: '100%', height: '600px', background: '#000', borderRadius: '12px', border: '1px solid #333' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background color="#333" gap={16} />
                <Controls style={{ fill: 'white' }} />
            </ReactFlow>
        </div>
    );
};

export default SkillTree;