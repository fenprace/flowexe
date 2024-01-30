import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { DataType, Execution, FlowConstant, FlowNode, FlowTask, TaskType } from './types';

export const createFlowConstant = <T extends DataType>(
  valueType: T,
  value: T extends 'string' ? string : number,
): FlowConstant<T> => {
  return {
    id: nanoid(),
    nodeType: 'constant',
    value,
    valueType,
  };
};

export const createFlowTask = (task: TaskType): FlowTask => {
  return {
    conditions: [],
    id: nanoid(),
    inputs: {},
    nodeType: 'task',
    task,
  };
};

export const setInput = (
  flowTask: FlowTask,
  targetIndex: string,
  id: string,
  sourceIndex: number,
): FlowTask => {
  return produce(flowTask, prev => {
    prev.inputs[targetIndex] = { id, sourceIndex };
  });
};

export const removeInput = (flowTask: FlowTask, targetIndex: string): FlowTask => {
  return produce(flowTask, prev => {
    delete prev.inputs[targetIndex];
  });
};

export const removeInputById = (flowTask: FlowTask, id: string): FlowTask => {
  const newInputs = { ...flowTask.inputs };
  for (const [targetIndex, input] of Object.entries(flowTask.inputs)) {
    if (input.id === id) delete newInputs[targetIndex];
  }
  return { ...flowTask, inputs: newInputs };
};

export const removeInputByIds = (flowTask: FlowTask, ids: string[]): FlowTask => {
  const newInputs = { ...flowTask.inputs };
  for (const [targetIndex, input] of Object.entries(flowTask.inputs)) {
    if (ids.includes(input.id)) delete newInputs[targetIndex];
  }
  return { ...flowTask, inputs: newInputs };
};

export const toExecution = (node: FlowNode): Execution => {
  if (node.nodeType === 'constant') {
    return {
      id: node.id,
      value: [node.value],
      status: 'fulfilled',
      node,
    };
  } else if (node.nodeType === 'task') {
    return {
      id: node.id,
      value: [],
      status: 'pending',
      node,
    };
  }

  throw new Error('unrecognized nodeType');
};
