export type DataType = 'string' | 'number';
export type TaskType = 'toUpperCase' | 'toLowerCase';

export interface FlowConstant<T extends DataType> {
  id: string;
  nodeType: 'constant';
  value: T extends 'string' ? string : number;
  valueType: T;
}

export interface FlowTask {
  id: string;
  inputs: Record<string, { id: string; sourceIndex: number }>; // targetIndex => { id, sourceIndex }
  nodeType: 'task';
  task: TaskType;
  conditions: { id: string; sourceIndex: number; targetIndex: number }[];
}

export interface FlowCondition {
  input: { id: string; sourceIndex: number; targetIndex: number };
  id: string;
  nodeType: 'condition';
}

export type FlowNode = FlowConstant<DataType> | FlowTask | FlowCondition;
export type Flow = FlowNode[];

export interface Execution {
  id: string;
  node: FlowNode;
  status: 'fulfilled' | 'executing' | 'pending' | 'rejected' | 'killed';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
}

export type Executions = Map<string, Execution>;
