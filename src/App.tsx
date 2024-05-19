import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/base.css";
import TextNode from "./components/TextNode";
import SettingsPanel from "./components/SettingsPanel";

const initialNode = [
  {
    id: "1",
    data: { label: "Test Message 1" },
    position: { x: 250, y: 5 },
    type: "textNode",
  },
];

let id: number = 0;

const getId = () => `node_${id++}`;

const App: React.FC = () => {
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<any>([]);
  const [nodeName, setNodeName] = useState<string>("");

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName("");
    }
  }, [nodeName, selectedElements, setNodes]);

  /**
   * On Node click, sets selected element value
   */
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  /**
   * Checks for any empty target nodes
   * @returns empty edges list
   */
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check if any node is unconnected
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  // Save flow to local storage
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert("Cannot save flow");
      } else {
        alert("Save successful!");
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  // Handle edge connection
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // console.log("Edge created: ", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      // console.log("Node created: ", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  /**
   * Sets the textNode property and memoizes the textNode
   */
  const nodeTypes = useMemo(
    () => ({
      textNode: TextNode,
    }),
    []
  );

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]);
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: false,
              }))
            );
          }}
        >
          <Background />
          <MiniMap />
          <Controls />
          <Panel position={"top-right"}>
            <button
              className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onSave}
            >
              Save Changes
            </button>
          </Panel>
        </ReactFlow>
      </div>
      <SettingsPanel
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
    </div>
  );
};

export default App;
