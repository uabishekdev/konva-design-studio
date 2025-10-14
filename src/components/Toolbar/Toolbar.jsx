import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Undo2,
  Redo2,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  FileText,
} from "lucide-react";
import { undo, redo, clearCanvas } from "../../store/slices/elementsSlice";
import { requestExport, zoom } from "../../store/slices/canvasSlice";
import { saveDesign, autoSave } from "../../utils/localStorage";

const Toolbar = () => {
  const dispatch = useDispatch();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { scale } = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvas);
  const elementsState = useSelector((state) => state.elements);

  const handleExport = () => {
    dispatch(requestExport());
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = () => {
    if (projectName.trim()) {
      const saved = saveDesign(projectName, canvasState, elementsState);
      if (saved) {
        setShowSaveDialog(false);
        setProjectName("");
        alert("Project saved successfully!");
      }
    }
  };

  const handleAutoSave = () => {
    autoSave(canvasState, elementsState);
  };

  React.useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [canvasState, elementsState]);

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800 mr-4">
            Invitation Studio
          </h1>
          <button
            className="toolbar-btn"
            title="Undo"
            onClick={() => dispatch(undo())}
          >
            <Undo2 size={20} />
          </button>
          <button
            className="toolbar-btn"
            title="Redo"
            onClick={() => dispatch(redo())}
          >
            <Redo2 size={20} />
          </button>
          <button
            className="toolbar-btn text-red-600 hover:bg-red-50"
            title="Clear Canvas"
            onClick={() => {
              if (window.confirm("Clear all elements from canvas?")) {
                dispatch(clearCanvas());
              }
            }}
          >
            <FileText size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="toolbar-btn"
            title="Zoom In"
            onClick={() => dispatch(zoom(1.2))}
          >
            <ZoomIn size={20} />
          </button>
          <span className="text-sm w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            className="toolbar-btn"
            title="Zoom Out"
            onClick={() => dispatch(zoom(1 / 1.2))}
          >
            <ZoomOut size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
            onClick={handleSave}
          >
            <Save size={18} />
            Save
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Save Project</h3>
            <input
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleSaveConfirm()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveConfirm}
                disabled={!projectName.trim()}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setProjectName("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
