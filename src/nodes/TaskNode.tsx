import { Handle, NodeProps, Position } from 'reactflow';

export interface TaskNodeData {
  name: string;
  input: any[];
  output: any[];
}

export const TaskNode = ({ data }: NodeProps<TaskNodeData>) => {
  const inHandles = data.input.map((_, i) => {
    return <Handle type="target" position={Position.Top} id={`i${i}`} key={i} />;
  });

  const outHandles = data.output.map((o, i) => {
    return <Handle type="source" position={Position.Bottom} id={`o${i}`} key={i} />;
  });

  return (
    <div
      style={{
        border: '1px solid #000',
        borderRadius: '0.25rem',
        padding: '0.5rem',
        background: '#FFF',
      }}
    >
      {inHandles}

      <p style={{ fontSize: '1rem' }}>
        {data.name}(
        <code
          style={{ background: 'rgba(0,0,0,0.1)', padding: '0 0.5rem', borderRadius: '0.25rem' }}
        >
          input0
        </code>
        )
      </p>

      {outHandles}
    </div>
  );
};
