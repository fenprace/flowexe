/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Task {
  name: string;
  input: { type: string; index: number }[];
  output: { type: string; index: number }[];
  execute: (args: any) => Promise<any>;
}

export const TASKS = {
  toUpperCase: {
    name: 'toUpperCase',
    input: [{ type: 'string', index: 0 }],
    output: [{ type: 'string', index: 0 }],
    execute: async (args: [string]) => [args[0].toUpperCase()],
  },
  toLowerCase: {
    name: 'toLowerCase',
    input: [{ type: 'string', index: 0 }],
    output: [{ type: 'string', index: 0 }],
    execute: async (args: [string]) => [args[0].toLowerCase()],
  },
  slice: {
    name: 'slice',
    input: [
      { type: 'string', index: 0 },
      { type: 'number', index: 1 },
      { type: 'number', index: 2 },
    ],
    output: [{ type: 'string', index: 0 }],
    execute: async (args: [string, number, number]) => [args[0].slice(args[1], args[2])],
  },
  alert: {
    name: 'alert',
    input: [{ type: 'string', index: 0 }],
    output: [],
    execute: async (args: [string]) => {
      alert(args[0]);
      return [];
    },
  },
};
