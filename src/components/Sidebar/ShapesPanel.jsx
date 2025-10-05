import React from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";

const ShapesPanel = () => {
  const dispatch = useDispatch();

  const shapes = [
    { name: "Rectangle", type: "rect" },
    { name: "Circle", type: "circle" },
    { name: "Star", type: "star" },
    { name: "Triangle", type: "triangle" },
  ];

  const addShape = (shapeType) => {
    const shapeConfig = {
      type: "shape",
      shape: shapeType,
      x: 400,
      y: 300,
      fill: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };

    if (shapeType === "rect") {
      shapeConfig.width = 200;
      shapeConfig.height = 150;
    } else if (shapeType === "circle") {
      shapeConfig.radius = 75;
    }

    dispatch(addElement(shapeConfig));
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Basic Shapes</h3>

      <div className="grid grid-cols-2 gap-3">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            onClick={() => addShape(shape.type)}
            className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center text-sm font-medium text-gray-700"
          >
            {shape.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapesPanel;
