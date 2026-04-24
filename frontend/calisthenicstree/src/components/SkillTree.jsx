import React, { useMemo } from 'react';
import ReactFlow, { Background, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { ReactComponent as DumbbellIcon } from '../pages/assets/dumbbell_icon.svg';
import { ReactComponent as LockIcon } from '../pages/assets/lock_icon.svg';

const CustomExerciseNode = ({ data }) => {
    const { id, label, category, exerciseLevel, userLevel, onComplete, onRevert } = data;
    
    const isLocked = exerciseLevel > userLevel;
    const isCurrent = exerciseLevel === userLevel;
    const isMastered = exerciseLevel < userLevel;

    let borderColor = '#333';
    let boxShadow = 'none';
    let bgColor = '#111';
    let textColor = 'white';
    let cursorStyle = (isCurrent || isMastered) ? 'pointer' : 'default';

    if (isMastered) {
        borderColor = '#22c55e';
        boxShadow = '0 0 10px #22c55e33';
    } else if (isCurrent) {
        borderColor = '#eab308';
        boxShadow = '0 0 15px #eab30880';
    } else if (isLocked) {
        borderColor = '#222';
        bgColor = '#0a0a0a';
        textColor = '#555555';
    }

    return (
        <div 
            onClick={() => {
                if (isCurrent && onComplete) {
                    onComplete(id, label, category, exerciseLevel); 
                } else if (isMastered && onRevert) {
                    onRevert(id, label, category, exerciseLevel);
                }
            }}
            style={{
                background: bgColor, border: `2px solid ${borderColor}`, borderRadius: '12px',
                padding: '15px', width: 160, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: textColor, cursor: cursorStyle,
                boxShadow: boxShadow, transition: 'all 0.3s ease'
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555', border: 'none' }} />

            {isLocked ? (
                <LockIcon style={{ width: '30px', height: '30px', marginBottom: '8px', color: '#555555' }} />
            ) : (
                <DumbbellIcon style={{ width: '35px', height: '35px', marginBottom: '8px', color: isMastered ? '#22c55e' : '#ffffff' }} />
            )}

            <div style={{ fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                {label}
            </div>

            <div style={{ fontSize: '10px', marginTop: '4px', color: isLocked ? '#444' : '#888' }}>
                Level {exerciseLevel}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: '#555', border: 'none' }} />
        </div>
    );
};

const nodeTypes = { customExercise: CustomExerciseNode };

const SkillTree = ({ exercises, userProgress, onComplete, onRevert }) => {

    const nodes = useMemo(() => {
        // 1. Group exercises by category and level first
        const groupedByLevel = {};
        exercises.forEach(ex => {
            const key = `${ex.category}-${ex.progressionLevel}`;
            if (!groupedByLevel[key]) groupedByLevel[key] = [];
            groupedByLevel[key].push(ex);
        });

        return exercises.map((ex) => {
            const key = `${ex.category}-${ex.progressionLevel}`;
            const siblings = groupedByLevel[key];
            const indexInGroup = siblings.findIndex(s => s.id === ex.id);

            // 2. Column Centers
            let centerX = 0;
            if (ex.category === 'Push') centerX = 150;
            if (ex.category === 'Legs') centerX = 550;
            if (ex.category === 'Pull') centerX = 950;

            // 3. Smart Centering Math
            // If 1 item: offset is 0
            // If 2 items: offsets are -60 and +60
            // If 3 items: offsets are -120, 0, +120
            const nodeWidth = 160;
            const spacing = 80; // Gap between nodes
            const totalWidth = (siblings.length * nodeWidth) + ((siblings.length - 1) * spacing);
            const startX = centerX - (totalWidth / 2) + (nodeWidth / 2);
            
            const finalX = startX + (indexInGroup * (nodeWidth + spacing));
            const yPos = (ex.progressionLevel * 200) + 50;

            const currentUserLevel = userProgress[ex.category] !== undefined ? userProgress[ex.category] : 0;

            return {
                id: ex.id.toString(),
                type: 'customExercise',
                position: { x: finalX, y: yPos },
                data: { 
                    id: ex.id,
                    label: ex.name,
                    category: ex.category,
                    exerciseLevel: ex.progressionLevel,
                    userLevel: currentUserLevel,
                    onComplete: onComplete,
                    onRevert: onRevert
                },
            };
        });
    }, [exercises, userProgress, onComplete, onRevert]);

    const edges = useMemo(() => {
        const generatedEdges = [];
        
        exercises.forEach((ex) => {
            if (ex.prerequisiteIds && ex.prerequisiteIds.length > 0) {
                
                ex.prerequisiteIds.forEach((preId) => {
                    const sourceEx = exercises.find(e => e.id === preId);
                    if (!sourceEx) return;

                    const isMastered = userProgress[sourceEx.category] > sourceEx.progressionLevel;
                    const isActive = userProgress[sourceEx.category] === sourceEx.progressionLevel;

                    generatedEdges.push({
                        id: `e${preId}-${ex.id}`,
                        source: preId.toString(),
                        target: ex.id.toString(),
                        animated: isActive,
                        style: { 
                            stroke: isMastered ? '#4ade80' : isActive ? '#fbbf24' : '#374151',
                            strokeWidth: 2 
                        },
                    });
                });
            }
        });
        
        return generatedEdges;
    }, [exercises, userProgress]); 

    return (
        <div style={{ width: '100%', height: '700px', background: '#000', borderRadius: '12px', border: '1px solid #333' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
                <Background color="#333" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default SkillTree;