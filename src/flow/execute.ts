/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flow, FlowTask } from './flow';

export interface Execution {
  id: string;
  value: any[];
  status: 'fulfilled' | 'executing' | 'pending' | 'rejected';
  task: null | FlowTask;
}

export type Executions = Record<string, Execution>;

export const prepareExecutions = (flow: Flow) => {
  const executions = {} as Executions;

  for (const constant of flow.constants) {
    executions[constant.id] = {
      id: constant.id,
      value: [constant.value],
      status: 'fulfilled',
      task: null,
    };
  }

  for (const task of flow.tasks) {
    executions[task.id] = {
      id: task.id,
      value: [],
      status: 'pending',
      task,
    };
  }

  return executions;
};

export const createExecute = (flow: Flow) => {
  const executions = prepareExecutions(flow);

  const execute = () => {
    for (const id of Object.keys(executions)) {
      const execution = executions[id];
      if (execution.status === 'fulfilled') continue;
      if (execution.status === 'executing') continue;
      if (execution.status === 'pending') {
        if (execution.task === null) break;
        const inputExecutions = execution.task.input.map(i => executions[i.id]);
        if (inputExecutions.every(i => i.status === 'fulfilled')) {
          const args = execution.task.input.map(
            ({ id, sourceIndex }) => executions[id].value[sourceIndex],
          );

          execution.status = 'executing';
          execution.task.task.execute(args).then((outputs: any) => {
            execution.status = 'fulfilled';
            execution.value = outputs;
            execute();
          });

          break;
        } else continue;
      }
      if (execution.status === 'rejected') break;
    }
  };

  return execute;
};
