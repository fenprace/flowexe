/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from 'reactflow';
import { stringify } from 'yaml';
import { createFlowConstant, createFlowTask, setInput } from '../core/flow';
import { TASKS } from '../core/tasks';
import { DataType, Flow, FlowConstant, FlowTask } from '../core/types';

export const INITIAL_FLOW: Flow = [];
INITIAL_FLOW.push(createFlowConstant('string', 'Hello, world!'));
INITIAL_FLOW.push(setInput(createFlowTask('toUpperCase'), '0', INITIAL_FLOW[0].id, 0));
INITIAL_FLOW.push(setInput(createFlowTask('toLowerCase'), '0', INITIAL_FLOW[1].id, 0));

export const flowToNodesAndEdges = (flow: Flow, prevNodes?: any) => {
  const nodes = [];
  const edges = [];
  let nextX = 0;
  let nextY = 0;

  const constants = flow.filter(node => node.nodeType === 'constant') as FlowConstant<DataType>[];
  const tasks = flow.filter(node => node.nodeType === 'task') as FlowTask[];

  for (const constant of constants) {
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
  for (const task of tasks) {
    for (const [targetIndex, input] of Object.entries(task.inputs)) {
      const constant = constants.find(c => c.id === input.id);
      if (constant) {
        edges.push({
          id: `${input.id}-${task.id}`,
          source: constant.id,
          sourceHandle: `o${input.sourceIndex}`,
          target: task.id,
          targetHandle: `i${targetIndex}`,
        });
        continue;
      }

      const sourceTask = tasks.find(t => t.id === input.id);
      if (sourceTask) {
        edges.push({
          id: `${input.id}-${task.id}`,
          source: sourceTask.id,
          sourceHandle: `o${input.sourceIndex}`,
          target: task.id,
          targetHandle: `i${targetIndex}`,
        });
        continue;
      }
    }

    const prevNode = prevNodes?.find((n: Node) => n.id === task.id);
    const taskDef = TASKS[task.task];
    nodes.push({
      id: task.id,
      position: prevNode ? prevNode.position : { x: nextX, y: nextY },
      type: 'task',
      data: {
        name: taskDef.name,
        input: taskDef.inputs,
        output: taskDef.outputs,
      },
    });

    nextY = nextY + 100;
  }

  return { nodes, edges };
};

export const exportFlow = (flow: Flow) => {
  console.log(stringify(flow));
};
