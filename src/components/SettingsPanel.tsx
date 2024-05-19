const SettingsPanel = ({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}: any) => {
  const handleInputChange = (event: any) => {
    setNodeName(event.target.value);
  };
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r-2 border-blue-200 p-4 text-sm bg-slate-50 w-64 h-screen text-black">
      {selectedNode ? (
        //Change Text panel
        <div>
          <h3 className="text-l mb-2 text-slate-500 text-center border-gray-200">
            Message
          </h3>
          <label htmlFor="messageInput" className="text text-gray-500">
            Text
          </label>
          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 mt-2 text-gray-700 border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            onClick={() => setSelectedElements([])}
          >
            Update
          </button>
        </div>
      ) : (
        //Settings panel
        <div
          className="bg-white p-3 border-2 border-blue-500 rounded cursor-move flex justify-center items-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
          onDragStart={(event) => onDragStart(event, "textNode")}
          draggable
        >
          💬 Message
        </div>
      )}
    </aside>
  );
};

export default SettingsPanel;
