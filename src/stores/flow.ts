import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { Flow, FlowConstant, INITIAL_FLOW, flowToNodesAndEdges } from '../flow/flow';

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  flow: Flow;
};

export const useFlow = create<FlowState>(() => {
  const { edges, nodes } = flowToNodesAndEdges(INITIAL_FLOW);

  return {
    flow: INITIAL_FLOW,
    edges,
    nodes,
  };
});

export const addConstantNode = () => {
  useFlow.setState(state => {
    const flow = {
      ...state.flow,
      constants: [...state.flow.constants, { id: v4(), value: 'new constant' }],
    };
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);

    return {
      flow,
      edges,
      nodes,
    };
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addTaskNode = (task: any) => {
  useFlow.setState(state => {
    const flow = {
      ...state.flow,
      tasks: [...state.flow.tasks, { id: v4(), task, input: [] }],
    };
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);

    return {
      flow,
      edges,
      nodes,
    };
  });
};

export const setConstantNode = (id: string, value: string) => {
  useFlow.setState(state => {
    const newConstants: FlowConstant[] = [];
    for (const constant of state.flow.constants) {
      if (constant.id === id) newConstants.push({ ...constant, value });
      else newConstants.push(constant);
    }

    const newNodes = [];
    for (const node of state.nodes) {
      if (node.id === id) newNodes.push({ ...node, data: { ...node.data, value } });
      else newNodes.push(node);
    }

    return { flow: { ...state.flow, constants: newConstants }, nodes: newNodes };
  });
};

export const onNodesDelete = (deleted: Node[]) => {
  const deletedIds = deleted.map(n => n.id);

  useFlow.setState(state => {
    const newConstants = [];
    for (const constant of state.flow.constants) {
      if (deletedIds.includes(constant.id)) continue;
      newConstants.push(constant);
    }

    const newTasks = [];
    for (const task of state.flow.tasks) {
      if (deletedIds.includes(task.id)) continue;

      const newInputs = [];
      for (const input of task.input) {
        if (deletedIds.includes(input.id)) continue;
        newInputs.push(input);
      }

      const newTask = {
        ...task,
        input: newInputs,
      };
      newTasks.push(newTask);
    }

    const flow = {
      ...state.flow,
      constants: newConstants,
      tasks: newTasks,
    };
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);
    return {
      flow,
      edges,
      nodes,
    };
  });
};

const handleIdToIndex = (handleId: null | undefined | string) => {
  if (!handleId) return 0;
  return parseInt(handleId.slice(1));
};

export const onEdgesDelete = (deleted: Edge[]) => {
  for (const edge of deleted) {
    useFlow.setState(state => {
      const newTasks = [];
      for (const task of state.flow.tasks) {
        if (task.id !== edge.target) {
          newTasks.push(task);
          continue;
        }

        const newInputs = [];
        for (const input of task.input) {
          if (
            input.id === edge.source &&
            input.sourceIndex === handleIdToIndex(edge.sourceHandle) &&
            input.targetIndex === handleIdToIndex(edge.targetHandle)
          )
            continue;
          newInputs.push(input);
        }

        newTasks.push({ ...task, input: newInputs });
      }

      const flow = {
        ...state.flow,
        tasks: newTasks,
      };
      const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);
      return {
        flow,
        edges,
        nodes,
      };
    });
  }
};

export const onNodesChange = (changes: NodeChange[]) => {
  useFlow.setState(state => {
    return { nodes: applyNodeChanges(changes, state.nodes) };
  });
};

export const onEdgesChange = (changes: EdgeChange[]) => {
  useFlow.setState(state => {
    return {
      edges: applyEdgeChanges(changes, state.edges),
    };
  });
};

export const onConnect = (connection: Connection) => {
  useFlow.setState(state => {
    const newTasks = [];
    for (const task of state.flow.tasks) {
      if (task.id !== connection.target) {
        newTasks.push(task);
        continue;
      }

      const newInputs = [
        ...task.input,
        {
          id: connection.source as string,
          sourceIndex: handleIdToIndex(connection.sourceHandle),
          targetIndex: handleIdToIndex(connection.targetHandle),
        },
      ];

      newTasks.push({ ...task, input: newInputs });
    }

    const flow = {
      ...state.flow,
      tasks: newTasks,
    };
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);
    return {
      flow,
      edges,
      nodes,
    };
  });
};
