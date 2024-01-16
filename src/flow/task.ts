/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Task {
  name: string;
  input: { type: string }[];
  output: { type: string }[];
  execute: (args: any) => Promise<any>;
}

export const TASKS = {
  toUpperCase: {
    name: 'toUpperCase',
    input: [{ type: 'string' }],
    output: [{ type: 'string' }],
    execute: async (args: [string]) => [args[0].toUpperCase()],
  },
  toLowerCase: {
    name: 'toLowerCase',
    input: [{ type: 'string' }],
    output: [{ type: 'string' }],
    execute: async (args: [string]) => [args[0].toLowerCase()],
  },
  alert: {
    name: 'alert',
    input: [{ type: 'string' }],
    output: [],
    execute: async (args: [string]) => {
      alert(args[0]);
      return [];
    },
  },
};
