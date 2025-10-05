import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";
import { setSelectedId } from "../../store/slices/canvasSlice";

const FramesPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);

  const frames = [
    {
      id: "rect",
      name: "Rectangle",
      type: "rect",
      width: 300,
      height: 200,
    },
    {
      id: "circle",
      name: "Circle",
      type: "circle",
      width: 300,
      height: 300,
    },
    {
      id: "rounded",
      name: "Rounded Rectangle",
      type: "rect",
      cornerRadius: 20,
      width: 300,
      height: 200,
    },
    {
      id: "ellipse",
      name: "Ellipse",
      type: "ellipse",
      width: 400,
      height: 250,
    },
  ];

  const addFrame = (frame) => {
    const frameId = Date.now().toString();

    dispatch(
      addElement({
        id: frameId,
        type: "shape",
        shapeType: frame.type,
        cornerRadius: frame.cornerRadius || 0,
        x: 400,
        y: 300,
        width: frame.width,
        height: frame.height,
        fill: "#f3f4f6",
        borderColor: "#9ca3af",
        borderWidth: 2,
        children: [],
      })
    );
    setTimeout(() => dispatch(setSelectedId(frameId)), 100);
  };

  const frameElements = elements.filter((el) => el.type === "shape");

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Frames</h3>

      {frameElements.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-medium mb-2">
            Select a frame to add images:
          </p>
          <div className="space-y-1">
            {frameElements.map((frame) => (
              <button
                key={frame.id}
                onClick={() => {
                  console.log("Selecting frame:", frame.id);
                  dispatch(setSelectedId(frame.id));
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedId === frame.id
                    ? "bg-blue-500 text-white font-medium"
                    : "bg-white hover:bg-blue-100 text-gray-700"
                }`}
              >
                {frame.clipShape === "circle" ? "⭕" : "▭"}{" "}
                {frame.clipShape || "Frame"} - {frame.id.slice(-6)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => addFrame(frame)}
            className={`group relative aspect-video bg-gradient-to-br ${frame.fill} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105`}
          >
            <svg
              viewBox="0 0 100 60"
              className="w-full h-full p-3"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={frame.preview}
                fill="rgba(255,255,255,0.7)"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-600"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
              <p className="text-white text-xs font-medium text-center">
                {frame.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FramesPanel;
