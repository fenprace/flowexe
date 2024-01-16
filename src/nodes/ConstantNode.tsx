import { ChangeEventHandler, useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { setConstantNode } from '../stores/flow';

export interface ConstantData {
  id: string;
  value: string;
}

export const ConstantNode = ({ data, isConnectable }: NodeProps<ConstantData>) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setConstantNode(data.id, e.target.value);
    },
    [data.id],
  );

  return (
    <div
      style={{
        border: '1px solid #000',
        borderRadius: '0.25rem',
        padding: '0.5rem',
        background: '#FFF',
      }}
    >
      <p style={{ fontSize: '1rem' }}>
        constant:{' '}
        <input
          style={{
            background: 'rgba(0,0,0,0.1)',
            padding: '0 0.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            fontFamily: 'monospace',
          }}
          value={data.value}
          onChange={handleChange}
        />
      </p>

      <Handle type="source" position={Position.Bottom} id="o0" isConnectable={isConnectable} />
    </div>
  );
};
