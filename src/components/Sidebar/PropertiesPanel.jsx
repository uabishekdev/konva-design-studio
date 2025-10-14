import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateElement } from "../../store/slices/elementsSlice";
import { SketchPicker } from "react-color";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  RotateCcw,
  Move,
  ZoomIn,
  Maximize2,
} from "lucide-react";

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);
  const element = elements.find((item) => item.id === selectedId);

  const handleUpdate = (updates) => {
    if (!selectedId) return;
    dispatch(updateElement({ id: selectedId, updates }));
  };

  if (!element) {
    return null;
  }

  const childImage =
    element.children?.length > 0
      ? elements.find((el) => el.id === element.children[0])
      : null;

  const renderImageManipulationControls = () => {
    if (!childImage) return null;

    return (
      <div className="p-4 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
        <h4 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
          <Maximize2 size={18} />
          Image in Frame
        </h4>
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2 text-blue-800">
              <Move size={16} />
              <label className="text-sm font-semibold">Position Image</label>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Click and drag the image inside the frame to reposition it
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2 text-blue-800">
              <ZoomIn size={16} />
              <label className="text-sm font-semibold">Zoom Image</label>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Scroll mouse wheel on frame to zoom in/out
            </p>

            <div className="flex items-center justify-between mt-3">
              <label className="text-sm font-medium text-gray-700">Scale</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={childImage.imageScale || 1}
                onChange={(e) =>
                  dispatch(
                    updateElement({
                      id: childImage.id,
                      updates: { imageScale: parseFloat(e.target.value) },
                    })
                  )
                }
                className="flex-1 mx-3 accent-blue-500"
              />
              <span className="text-sm w-14 text-right font-semibold text-blue-600">
                {Math.round((childImage.imageScale || 1) * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              dispatch(
                updateElement({
                  id: childImage.id,
                  updates: {
                    imageOffset: { x: 0, y: 0 },
                    imageScale: 1,
                  },
                })
              )
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
          >
            <RotateCcw size={18} />
            Reset Position & Zoom
          </button>
        </div>
      </div>
    );
  };

  const renderTextControls = () => (
    <>
      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Text</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm">Font Size</label>
            <input
              type="number"
              value={element.fontSize}
              onChange={(e) =>
                handleUpdate({ fontSize: parseInt(e.target.value, 10) })
              }
              className="w-20 p-2 border rounded"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm">Font Family</label>
            <select
              value={element.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className="p-2 border rounded text-sm"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Lora, serif">Lora</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Great Vibes, cursive">Great Vibes</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm">Align</label>
            <div className="flex gap-1">
              <button
                onClick={() => handleUpdate({ align: "left" })}
                className={`p-2 rounded ${
                  element.align === "left"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <AlignLeft size={18} />
              </button>
              <button
                onClick={() => handleUpdate({ align: "center" })}
                className={`p-2 rounded ${
                  element.align === "center"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <AlignCenter size={18} />
              </button>
              <button
                onClick={() => handleUpdate({ align: "right" })}
                className={`p-2 rounded ${
                  element.align === "right"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <AlignRight size={18} />
              </button>
            </div>
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
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
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
            className="w-5 h-5 accent-blue-500"
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
            className="w-20 p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderShapeControls = () => (
    <div className="p-4 border-b">
      <h4 className="font-medium mb-3">Fill Color</h4>
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

      {element.type === "shape" && renderImageManipulationControls()}

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Transform</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Width</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) =>
                handleUpdate({ width: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Height</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) =>
                handleUpdate({ height: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">
              Rotation: {Math.round(element.rotation || 0)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={Math.round(element.rotation || 0)}
              onChange={(e) =>
                handleUpdate({ rotation: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Appearance</h4>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Opacity: {Math.round(element.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={element.opacity}
            onChange={(e) =>
              handleUpdate({ opacity: parseFloat(e.target.value) })
            }
            className="w-full accent-blue-500"
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
