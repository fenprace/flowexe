/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactFlow, { Background, Controls, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { createExecute } from './flow/execute';
import { exportFlow } from './flow/flow';
import { TASKS } from './flow/task';
import './index.css';
import { ConstantNode } from './nodes/ConstantNode';
import { TaskNode } from './nodes/TaskNode';
import {
  addConstantNode,
  addTaskNode,
  onConnect,
  onEdgesChange,
  onEdgesDelete,
  onNodesChange,
  onNodesDelete,
  useFlow,
} from './stores/flow';

const nodeTypes = {
  task: TaskNode,
  constant: ConstantNode,
};

export const Root = () => {
  const flow = useFlow(state => state.flow);
  const edges = useFlow(state => state.edges);
  const nodes = useFlow(state => state.nodes);

  return (
    <div style={{ height: '100svh', padding: '1rem' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
      >
        <Background />
        <Controls />

        <Panel position="top-left">
          <button
            onClick={addConstantNode}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            add constant
          </button>

          <button
            onClick={() => addTaskNode(TASKS.toLowerCase)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            add toLowerCase task
          </button>

          <button
            onClick={() => addTaskNode(TASKS.toUpperCase)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            add toUpperCase task
          </button>

          <button
            onClick={() => addTaskNode(TASKS.slice)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            add slice task
          </button>

          <button
            onClick={() => addTaskNode(TASKS.alert)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            add alert task
          </button>
        </Panel>

        <Panel position="top-right">
          <button
            onClick={() => createExecute(flow)()}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            execute
          </button>

          <button
            onClick={() => exportFlow(flow)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '1rem',
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }}
          >
            export
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
