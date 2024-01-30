import { DataType, TaskType } from './types';

export interface Task {
  name: string;
  inputs: DataType[];
  outputs: DataType[];
}

export const TASKS: Record<TaskType, Task> = {
  toUpperCase: {
    name: 'toUpperCase',
    inputs: ['string'],
    outputs: ['string'],
  },
  toLowerCase: {
    name: 'toLowerCase',
    inputs: ['string'],
    outputs: ['string'],
  },
};
