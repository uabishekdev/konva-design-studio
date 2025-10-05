import React from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";

const FramesPanel = () => {
  const dispatch = useDispatch();

  const frames = [
    {
      id: "rect",
      name: "Rectangle",
      shape: "rectangle",
      preview: "M0,0 L100,0 L100,60 L0,60 Z",
    },
    {
      id: "circle",
      name: "Circle",
      shape: "circle",
      preview: "M50,30 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0",
    },
    {
      id: "rounded",
      name: "Rounded",
      shape: "rectangle",
      cornerRadius: 20,
      preview:
        "M10,0 L90,0 Q100,0 100,10 L100,50 Q100,60 90,60 L10,60 Q0,60 0,50 L0,10 Q0,0 10,0",
    },
    {
      id: "ellipse",
      name: "Ellipse",
      shape: "ellipse",
      preview: "M50,10 Q80,10 90,30 Q90,50 50,50 Q10,50 10,30 Q10,10 50,10",
    },
  ];

  const addFrame = (frame) => {
    dispatch(
      addElement({
        type: "shape",
        shape: frame.shape,
        clipShape:
          frame.shape === "circle"
            ? "circle"
            : frame.shape === "ellipse"
            ? "ellipse"
            : null,
        cornerRadius: frame.cornerRadius || 0,
        x: 400,
        y: 300,
        width: 300,
        height: 200,
        fill: "#e0e0e0",
        showBorder: true,
        borderColor: "#666",
        borderWidth: 2,
      })
    );
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Frames</h3>

      <div className="grid grid-cols-2 gap-3">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => addFrame(frame)}
            className="group relative aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <svg
              viewBox="0 0 100 60"
              className="w-full h-full p-2"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={frame.preview}
                fill="rgba(255,255,255,0.7)"
                stroke="#4ade80"
                strokeWidth="2"
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

      <div className="mt-6">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Basic Shapes</h4>
        <div className="grid grid-cols-3 gap-2">
          {["Square", "Triangle", "Star", "Heart", "Arrow", "Cloud"].map(
            (shape) => (
              <button
                key={shape}
                className="aspect-square bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-xs font-medium text-gray-700"
              >
                {shape}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FramesPanel;
