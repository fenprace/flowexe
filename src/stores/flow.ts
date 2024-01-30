import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { create } from 'zustand';
import {
  createFlowConstant,
  createFlowTask,
  removeInput,
  removeInputByIds,
  setInput,
} from '../core/flow';
import { DataType, Flow, FlowNode, FlowTask, TaskType } from '../core/types';
import { INITIAL_FLOW, flowToNodesAndEdges } from '../flow/flow';

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
    const flow = [...state.flow, createFlowConstant('string', 'new constant')];
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);

    return {
      flow,
      edges,
      nodes,
    };
  });
};

export const addTaskNode = (task: TaskType) => {
  useFlow.setState(state => {
    const flow = [...state.flow, createFlowTask(task)];
    const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);

    return {
      flow,
      edges,
      nodes,
    };
  });
};

export const setConstantNode = <T extends DataType>(id: string, value: T) => {
  useFlow.setState(state => {
    const newFlow: Flow = [];
    for (const flowNode of state.flow) {
      if (flowNode.id === id) newFlow.push({ ...flowNode, value } as FlowNode);
      else newFlow.push(flowNode);
    }

    const newNodes = [];
    for (const node of state.nodes) {
      if (node.id === id) newNodes.push({ ...node, data: { ...node.data, value } });
      else newNodes.push(node);
    }

    return { flow: newFlow, nodes: newNodes };
  });
};

export const onNodesDelete = (deleted: Node[]) => {
  const deletedIds = deleted.map(n => n.id);

  useFlow.setState(state => {
    const newFlow = [];
    for (const flowNode of state.flow) {
      if (deletedIds.includes(flowNode.id)) continue;

      if (flowNode.nodeType === 'constant') newFlow.push(flowNode);
      if (flowNode.nodeType === 'task') {
        const newFlowTask = removeInputByIds(flowNode as FlowTask, deletedIds);
        newFlow.push(newFlowTask);
      }
    }

    const { edges, nodes } = flowToNodesAndEdges(newFlow, state.nodes);
    return {
      flow: newFlow,
      edges,
      nodes,
    };
  });
};

const handleIdToIndex = (handleId: null | undefined | string) => {
  if (!handleId) return 0;
  return parseInt(handleId.slice(1));
};

const handleIdToTargetIndex = (handleId: null | undefined | string) => {
  if (!handleId) return '0';
  return handleId.slice(1);
};

export const onEdgesDelete = (deleted: Edge[]) => {
  for (const edge of deleted) {
    useFlow.setState(state => {
      const newFlow: Flow = [];
      for (const flowNode of state.flow) {
        if (flowNode.nodeType === 'constant') {
          newFlow.push(flowNode);
          continue;
        }

        if (flowNode.id !== edge.target) {
          newFlow.push(flowNode);
          continue;
        }

        const targetIndex = handleIdToTargetIndex(edge.targetHandle);
        const newFlowNode = removeInput(flowNode as FlowTask, targetIndex);
        newFlow.push(newFlowNode);
      }

      const { edges, nodes } = flowToNodesAndEdges(newFlow, state.nodes);
      return {
        newFlow,
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
    const newFlow: Flow = [];
    for (const flowNode of state.flow) {
      if (flowNode.nodeType === 'constant') {
        newFlow.push(flowNode);
        continue;
      }

      if (flowNode.id !== connection.target) {
        newFlow.push(flowNode);
        continue;
      }

      const targetIndex = handleIdToTargetIndex(connection.targetHandle);
      const sourceIndex = handleIdToIndex(connection.sourceHandle);

      const newFlowNode = setInput(
        flowNode as FlowTask,
        targetIndex,
        connection.source as string,
        sourceIndex,
      );
      newFlow.push(newFlowNode);
    }

    const { edges, nodes } = flowToNodesAndEdges(newFlow, state.nodes);
    return {
      flow: newFlow,
      edges,
      nodes,
    };
  });
};
