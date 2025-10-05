import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { togglePlay } from "../../store/slices/timelineSlice";

const Toolbar = () => {
  const dispatch = useDispatch();
  const { isPlaying } = useSelector((state) => state.timeline);

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800 mr-4">Design Editor</h1>

        <button className="toolbar-btn" title="Undo">
          <Undo2 size={20} />
        </button>
        <button className="toolbar-btn" title="Redo">
          <Redo2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="toolbar-btn"
          onClick={() => dispatch(togglePlay())}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <button className="toolbar-btn" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button className="toolbar-btn" title="Zoom Out">
          <ZoomOut size={20} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <button className="toolbar-btn" title="Import">
          <Upload size={20} />
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
  );
};

export default Toolbar;
