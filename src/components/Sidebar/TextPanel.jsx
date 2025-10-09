import React from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";
import { Type } from "lucide-react";

const TextPanel = () => {
  const dispatch = useDispatch();

  const addText = (preset) => {
    dispatch(
      addElement({
        type: "text",
        x: 350,
        y: 250,
        ...preset,
      })
    );
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Add Text</h3>
      <div className="space-y-3">
        <button
          onClick={() =>
            addText({
              text: "Heading",
              fontSize: 82,
              width: 350,
              fontFamily: "Inter, sans-serif",
            })
          }
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <span className="text-3xl font-bold">Add a Heading</span>
        </button>
        <button
          onClick={() =>
            addText({
              text: "Subheading",
              fontSize: 50,
              width: 350,
              fontFamily: "Inter, sans-serif",
            })
          }
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <span className="text-xl font-semibold">Add a Subheading</span>
        </button>
        <button
          onClick={() =>
            addText({
              text: "A little bit of body text",
              fontSize: 32,
              width: 350,
              fontFamily: "Inter, sans-serif",
            })
          }
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <span>Add body text</span>
        </button>
      </div>
    </div>
  );
};

export default TextPanel;
