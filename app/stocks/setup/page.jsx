'use client';
import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Boiler from '../../boiler';

import Appbar from './appbar';

const initialNodes = [
  {
    id: 'jhcjhvjch',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: 'fvghdfjbvnb',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

function Flow() {
  
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <Boiler title={`Store Preview`}>
      <Appbar />
      <div style={{ height: '100%' }}>
        <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Boiler>
  );
}

export default Flow;
