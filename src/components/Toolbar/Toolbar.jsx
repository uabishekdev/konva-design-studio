import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Undo2,
  Redo2,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Magnet,
  FileText,
} from "lucide-react";
import { undo, redo, clearCanvas } from "../../store/slices/elementsSlice";
import {
  requestExport,
  zoom,
  toggleGrid,
  toggleSnapToGrid,
  setScale,
} from "../../store/slices/canvasSlice";
import { saveDesign, autoSave } from "../../utils/localStorage";

const Toolbar = () => {
  const dispatch = useDispatch();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState("");

  const { scale, showGrid, snapToGrid } = useSelector((state) => state.canvas);
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
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800 mr-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invitation Studio Pro
          </h1>

          <div className="h-8 w-px bg-gray-300"></div>

          <button
            className="toolbar-btn"
            title="Undo (Ctrl+Z)"
            onClick={() => dispatch(undo())}
          >
            <Undo2 size={20} />
          </button>
          <button
            className="toolbar-btn"
            title="Redo (Ctrl+Y)"
            onClick={() => dispatch(redo())}
          >
            <Redo2 size={20} />
          </button>

          <div className="h-8 w-px bg-gray-300 mx-1"></div>

          <button
            className={`toolbar-btn ${
              showGrid ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Toggle Grid"
            onClick={() => dispatch(toggleGrid())}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            className={`toolbar-btn ${
              snapToGrid ? "bg-blue-100 text-blue-600" : ""
            }`}
            title="Snap to Grid"
            onClick={() => dispatch(toggleSnapToGrid())}
          >
            <Magnet size={20} />
          </button>

          <div className="h-8 w-px bg-gray-300 mx-1"></div>

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

          <select
            value={Math.round(scale * 100)}
            onChange={(e) => dispatch(setScale(parseInt(e.target.value) / 100))}
            className="text-sm border rounded px-2 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>

          <button
            className="toolbar-btn"
            title="Zoom Out"
            onClick={() => dispatch(zoom(1 / 1.2))}
          >
            <ZoomOut size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            onClick={handleSave}
          >
            <Save size={18} />
            Save
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            onClick={handleExport}
          >
            <Download size={18} />
            Export PNG
          </button>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Save Project</h3>
            <input
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleSaveConfirm()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveConfirm}
                disabled={!projectName.trim()}
                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save Project
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setProjectName("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
