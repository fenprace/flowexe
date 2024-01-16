import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { Flow, INITIAL_FLOW, flowToNodesAndEdges } from '../flow/flow';

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

export const setConstantNode = (id: string, value: string) => {
  useFlow.setState(state => {
    const newConstants = [];
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

// export const onNodesDelete = (nodes: Node[]) => {
//   useFlow.setState(state => {
//     const flow = {
//       ...state.flow,
//       constants: state.flow.constants.filter(c => !nodes.find(n => n.id === c.id)),
//     };
//     const { edges, nodes } = flowToNodesAndEdges(flow, state.nodes);

//     return {
//       flow,
//       edges,
//       nodes,
//     };
//   });
// }

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
    return {
      edges: addEdge(connection, state.edges),
    };
  });
};
