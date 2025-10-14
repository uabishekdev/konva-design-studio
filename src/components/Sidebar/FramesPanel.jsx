import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";
import { setSelectedId } from "../../store/slices/canvasSlice";
import { Info } from "lucide-react";

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
        fill: "#ffffff",
        borderColor: "#d4a574",
        borderWidth: 3,
        children: [],
      })
    );
    setTimeout(() => dispatch(setSelectedId(frameId)), 100);
  };

  const frameElements = elements.filter((el) => el.type === "shape");

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Frames</h3>

      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">
              How to add photos to frames:
            </p>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click any frame below to add it to canvas</li>
              <li>Click the frame on canvas to upload photo</li>
              <li>Or select frame and use Images tab to upload</li>
            </ol>
          </div>
        </div>
      </div>

      {frameElements.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-xs text-green-800 font-semibold mb-2">
            📸 Frames on Canvas:
          </p>
          <div className="space-y-1">
            {frameElements.map((frame) => {
              const hasImage = frame.children && frame.children.length > 0;
              return (
                <button
                  key={frame.id}
                  onClick={() => {
                    dispatch(setSelectedId(frame.id));
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center justify-between ${
                    selectedId === frame.id
                      ? "bg-blue-500 text-white font-medium shadow-md"
                      : "bg-white hover:bg-blue-100 text-gray-700"
                  }`}
                >
                  <span>
                    {frame.shapeType === "circle" ? "⭕" : "▭"}{" "}
                    {frame.shapeType || "Frame"} - #{frame.id.slice(-6)}
                  </span>
                  {hasImage ? (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      ✓ Photo
                    </span>
                  ) : (
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      Empty
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => addFrame(frame)}
            className="group relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-gray-300 hover:border-blue-500"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {frame.type === "circle" ? (
                <div className="w-20 h-20 rounded-full border-4 border-gray-400 group-hover:border-blue-500 transition-colors"></div>
              ) : frame.type === "ellipse" ? (
                <div className="w-24 h-16 rounded-full border-4 border-gray-400 group-hover:border-blue-500 transition-colors"></div>
              ) : (
                <div
                  className={`w-24 h-16 border-4 border-gray-400 group-hover:border-blue-500 transition-colors ${
                    frame.cornerRadius ? "rounded-lg" : ""
                  }`}
                ></div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
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
