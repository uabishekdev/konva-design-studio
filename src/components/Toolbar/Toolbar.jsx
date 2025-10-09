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
import { undo, redo } from "../../store/slices/elementsSlice";
import { requestExport, zoom } from "../../store/slices/canvasSlice";

const Toolbar = () => {
  const dispatch = useDispatch();
  const { isPlaying } = useSelector((state) => state.timeline);
  const { scale } = useSelector((state) => state.canvas);

  const handleExport = () => {
    dispatch(requestExport());
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800 mr-4">Design Editor</h1>
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
