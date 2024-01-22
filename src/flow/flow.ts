/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from 'reactflow';
import { v4 } from 'uuid';
import { stringify } from 'yaml';
import { TASKS } from './task';

export interface FlowConstant {
  id: string;
  value: string;
}

export interface FlowTask {
  id: string;
  task: any;
  input: { id: string; sourceIndex: number; targetIndex: number }[];
}

export interface Flow {
  constants: FlowConstant[];
  tasks: FlowTask[];
}

const constants = [{ id: v4(), value: 'Hello, world!' }];
const tasks = [];
tasks.push({
  id: v4(),
  task: TASKS.toUpperCase,
  input: [{ id: constants[0].id, sourceIndex: 0, targetIndex: 0 }],
});
tasks.push({
  id: v4(),
  task: TASKS.toLowerCase,
  input: [{ id: tasks[0].id, sourceIndex: 0, targetIndex: 0 }],
});
tasks.push({
  id: v4(),
  task: TASKS.alert,
  input: [{ id: tasks[1].id, sourceIndex: 0, targetIndex: 0 }],
});

export const INITIAL_FLOW = {
  constants,
  tasks,
};

export const flowToNodesAndEdges = (flow: Flow, prevNodes?: any) => {
  const nodes = [];
  const edges = [];
  let nextX = 0;
  let nextY = 0;

  for (const constant of flow.constants) {
    const prevNode = prevNodes?.find((n: Node) => n.id === constant.id);
    nodes.push({
      id: constant.id,
      position: prevNode ? prevNode.position : { x: nextX, y: nextY },
      type: 'constant',
      data: {
        id: constant.id,
        value: constant.value,
      },
    });

    nextX = nextX + 300;
  }

  nextX = 0;
  nextY = 100;
  for (const task of flow.tasks) {
    for (let i = 0; i < task.input.length; i++) {
      const input = task.input[i];
      if (!input) continue;

      const constant = flow.constants.find(c => c.id === input.id);
      if (constant) {
        edges.push({
          id: `${input.id}-${task.id}`,
          source: constant.id,
          sourceHandle: `o${input.sourceIndex}`,
          target: task.id,
          targetHandle: `i${input.targetIndex}`,
        });
        continue;
      }

      const sourceTask = flow.tasks.find(t => t.id === input.id);
      if (sourceTask) {
        edges.push({
          id: `${input.id}-${task.id}`,
          source: sourceTask.id,
          sourceHandle: `o${input.sourceIndex}`,
          target: task.id,
          targetHandle: `i${input.targetIndex}`,
        });
        continue;
      }
    }

    const prevNode = prevNodes?.find((n: Node) => n.id === task.id);
    nodes.push({
      id: task.id,
      position: prevNode ? prevNode.position : { x: nextX, y: nextY },
      type: 'task',
      data: {
        name: task.task.name,
        input: task.task.input,
        output: task.task.output,
      },
    });

    nextY = nextY + 100;
  }

  return { nodes, edges };
};

export const exportFlow = (flow: Flow) => {
  const newFlow = {
    constants: flow.constants,
    tasks: flow.tasks.map(task => {
      return {
        ...task,
        task: { type: task.task.name },
      };
    }),
  };

  console.log(stringify(newFlow));

  alert('check console.log!');
};
