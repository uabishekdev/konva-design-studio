import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateElement } from "../../store/slices/elementsSlice";
import { SketchPicker } from "react-color";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const element = useSelector((state) =>
    state.elements.items.find((item) => item.id === selectedId)
  );

  const handleUpdate = (updates) => {
    if (!selectedId) return;
    dispatch(updateElement({ id: selectedId, updates }));
  };

  if (!element) {
    return null; // Don't render anything if no element is selected
  }

  const renderTextControls = () => (
    <>
      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Text</h4>
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-sm">Font Size</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) =>
              handleUpdate({ fontSize: parseInt(e.target.value, 10) })
            }
            className="w-20 p-1 border rounded"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm">Align</label>
          <div className="flex gap-1">
            <button
              onClick={() => handleUpdate({ align: "left" })}
              className={`p-1.5 rounded ${
                element.align === "left" ? "bg-blue-100" : ""
              }`}
            >
              <AlignLeft size={18} />
            </button>
            <button
              onClick={() => handleUpdate({ align: "center" })}
              className={`p-1.5 rounded ${
                element.align === "center" ? "bg-blue-100" : ""
              }`}
            >
              <AlignCenter size={18} />
            </button>
            <button
              onClick={() => handleUpdate({ align: "right" })}
              className={`p-1.5 rounded ${
                element.align === "right" ? "bg-blue-100" : ""
              }`}
            >
              <AlignRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 border-b">
        <h4 className="font-medium mb-2">Color</h4>
        <SketchPicker
          color={element.fill}
          onChange={(color) => handleUpdate({ fill: color.hex })}
          disableAlpha
          width="100%"
        />
      </div>
    </>
  );

  const renderImageControls = () => (
    <div className="p-4 border-b">
      <h4 className="font-medium mb-3">Filters</h4>
      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-sm">Grayscale</label>
        <input
          type="checkbox"
          checked={element.filters?.includes("Grayscale")}
          onChange={(e) => {
            const filters = e.target.checked
              ? [...(element.filters || []), "Grayscale"]
              : element.filters.filter((f) => f !== "Grayscale");
            handleUpdate({ filters });
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm">Blur</label>
        <input
          type="number"
          value={element.blurRadius || 0}
          onChange={(e) =>
            handleUpdate({
              blurRadius: parseInt(e.target.value, 10),
              filters: Array.from(
                new Set([...(element.filters || []), "Blur"])
              ),
            })
          }
          className="w-20 p-1 border rounded"
        />
      </div>
    </div>
  );

  const renderShapeControls = () => (
    <div className="p-4 border-b">
      <h4 className="font-medium mb-2">Fill Color</h4>
      <SketchPicker
        color={element.fill}
        onChange={(color) => handleUpdate({ fill: color.hex })}
        disableAlpha
        width="100%"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center p-3 border-b bg-gray-50">
        <h3 className="font-semibold text-center flex-1 text-gray-700">
          Properties
        </h3>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Transform</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label>X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Width</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) =>
                handleUpdate({ width: parseInt(e.target.value) })
              }
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label>Height</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) =>
                handleUpdate({ height: parseInt(e.target.value) })
              }
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label>Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              value={Math.round(element.rotation || 0)}
              onChange={(e) =>
                handleUpdate({ rotation: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Appearance</h4>
        <div className="flex items-center justify-between">
          <label className="text-sm">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={element.opacity}
            onChange={(e) =>
              handleUpdate({ opacity: parseFloat(e.target.value) })
            }
            className="w-32"
          />
        </div>
      </div>

      {element.type === "text" && renderTextControls()}
      {element.type === "image" && renderImageControls()}
      {(element.type === "shape" || element.type === "frame") &&
        renderShapeControls()}
    </div>
  );
};

export default PropertiesPanel;
