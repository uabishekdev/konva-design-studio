import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateElement,
  finishUpdateElement,
} from "../../store/slices/elementsSlice";
import { SketchPicker } from "react-color";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  Move,
  ZoomIn,
  Maximize2,
  Droplet,
  Sparkles,
} from "lucide-react";

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);
  const element = elements.find((item) => item.id === selectedId);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState("fill");

  const handleUpdate = (updates) => {
    if (!selectedId) return;
    dispatch(updateElement({ id: selectedId, updates }));
  };

  const handleUpdateFinish = (updates) => {
    if (!selectedId) return;
    dispatch(updateElement({ id: selectedId, updates }));
    dispatch(finishUpdateElement());
  };

  if (!element) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Sparkles className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="font-medium">No element selected</p>
        <p className="text-sm mt-1">Select an element to edit its properties</p>
      </div>
    );
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
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <span className="text-lg">T</span>
          Text Properties
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Font Family
            </label>
            <select
              value={element.fontFamily}
              onChange={(e) =>
                handleUpdateFinish({ fontFamily: e.target.value })
              }
              className="w-full p-2 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Lora, serif">Lora</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Great Vibes, cursive">Great Vibes</option>
              <option value="Dancing Script, cursive">Dancing Script</option>
              <option value="Pacifico, cursive">Pacifico</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Font Size
              </label>
              <input
                type="number"
                value={element.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value, 10) })
                }
                onBlur={() => dispatch(finishUpdateElement())}
                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Line Height
              </label>
              <input
                type="number"
                step="0.1"
                value={element.lineHeight || 1.2}
                onChange={(e) =>
                  handleUpdateFinish({ lineHeight: parseFloat(e.target.value) })
                }
                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Text Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const currentStyle = element.fontStyle || "normal";
                  const newStyle = currentStyle.includes("bold")
                    ? "normal"
                    : "bold";
                  handleUpdateFinish({ fontStyle: newStyle });
                }}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.fontStyle?.includes("bold")
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <Bold size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => {
                  const currentStyle = element.fontStyle || "normal";
                  const newStyle = currentStyle.includes("italic")
                    ? "normal"
                    : "italic";
                  handleUpdateFinish({ fontStyle: newStyle });
                }}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.fontStyle?.includes("italic")
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <Italic size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => {
                  const currentDeco = element.textDecoration || "";
                  const newDeco = currentDeco.includes("underline")
                    ? ""
                    : "underline";
                  handleUpdateFinish({ textDecoration: newDeco });
                }}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.textDecoration?.includes("underline")
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <Underline size={18} className="mx-auto" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Text Alignment
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateFinish({ align: "left" })}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.align === "left"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <AlignLeft size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => handleUpdateFinish({ align: "center" })}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.align === "center"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <AlignCenter size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => handleUpdateFinish({ align: "right" })}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  element.align === "right"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
              >
                <AlignRight size={18} className="mx-auto" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Letter Spacing: {element.letterSpacing || 0}px
            </label>
            <input
              type="range"
              min="-5"
              max="20"
              step="0.5"
              value={element.letterSpacing || 0}
              onChange={(e) =>
                handleUpdate({ letterSpacing: parseFloat(e.target.value) })
              }
              onMouseUp={() => dispatch(finishUpdateElement())}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Droplet size={18} />
          Text Color
        </h4>
        <div className="relative">
          <button
            onClick={() => {
              setColorPickerType("fill");
              setShowColorPicker(!showColorPicker);
            }}
            className="w-full p-3 border-2 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors"
          >
            <span className="text-sm font-medium">Text Color</span>
            <div
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: element.fill }}
            />
          </button>
          {showColorPicker && colorPickerType === "fill" && (
            <div className="absolute z-10 mt-2">
              <div
                className="fixed inset-0"
                onClick={() => setShowColorPicker(false)}
              />
              <SketchPicker
                color={element.fill}
                onChange={(color) => handleUpdate({ fill: color.hex })}
                onChangeComplete={() => dispatch(finishUpdateElement())}
              />
            </div>
          )}
        </div>

        {/* Text Stroke */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Text Outline
            </label>
            <input
              type="checkbox"
              checked={!!element.stroke}
              onChange={(e) => {
                if (e.target.checked) {
                  handleUpdateFinish({ stroke: "#000000", strokeWidth: 2 });
                } else {
                  handleUpdateFinish({ stroke: null, strokeWidth: 0 });
                }
              }}
              className="w-5 h-5 accent-blue-500"
            />
          </div>
          {element.stroke && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setColorPickerType("stroke");
                  setShowColorPicker(!showColorPicker);
                }}
                className="w-full p-2 border-2 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors"
              >
                <span className="text-xs">Outline Color</span>
                <div
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: element.stroke }}
                />
              </button>
              {showColorPicker && colorPickerType === "stroke" && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <SketchPicker
                    color={element.stroke}
                    onChange={(color) => handleUpdate({ stroke: color.hex })}
                    onChangeComplete={() => dispatch(finishUpdateElement())}
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Outline Width: {element.strokeWidth || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={element.strokeWidth || 0}
                  onChange={(e) =>
                    handleUpdate({ strokeWidth: parseInt(e.target.value) })
                  }
                  onMouseUp={() => dispatch(finishUpdateElement())}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderImageControls = () => (
    <div className="p-4 border-b">
      <h4 className="font-medium mb-3">Image Adjustments</h4>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-700">Brightness</label>
            <span className="text-xs text-gray-500">
              {element.brightness || 0}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.brightness || 0}
            onChange={(e) =>
              handleUpdate({ brightness: parseInt(e.target.value) })
            }
            onMouseUp={() => dispatch(finishUpdateElement())}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-700">Contrast</label>
            <span className="text-xs text-gray-500">
              {element.contrast || 0}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.contrast || 0}
            onChange={(e) =>
              handleUpdate({ contrast: parseInt(e.target.value) })
            }
            onMouseUp={() => dispatch(finishUpdateElement())}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-700">Saturation</label>
            <span className="text-xs text-gray-500">
              {element.saturation || 0}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.saturation || 0}
            onChange={(e) =>
              handleUpdate({ saturation: parseInt(e.target.value) })
            }
            onMouseUp={() => dispatch(finishUpdateElement())}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-700">Blur</label>
            <span className="text-xs text-gray-500">{element.blur || 0}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={element.blur || 0}
            onChange={(e) =>
              handleUpdate({
                blur: parseInt(e.target.value),
                filters: ["Blur"],
                blurRadius: parseInt(e.target.value),
              })
            }
            onMouseUp={() => dispatch(finishUpdateElement())}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={element.filters?.includes("Grayscale")}
              onChange={(e) => {
                const filters = e.target.checked
                  ? [...(element.filters || []), "Grayscale"]
                  : element.filters?.filter((f) => f !== "Grayscale") || [];
                handleUpdateFinish({ filters });
              }}
              className="w-5 h-5 accent-blue-500"
            />
            <span className="text-sm font-medium">Grayscale</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderShapeControls = () => (
    <div className="p-4 border-b">
      <h4 className="font-medium mb-3">Fill Color</h4>
      <div className="relative">
        <button
          onClick={() => {
            setColorPickerType("fill");
            setShowColorPicker(!showColorPicker);
          }}
          className="w-full p-3 border-2 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors"
        >
          <span className="text-sm font-medium">Background</span>
          <div
            className="w-8 h-8 rounded border-2 border-gray-300"
            style={{ backgroundColor: element.fill }}
          />
        </button>
        {showColorPicker && colorPickerType === "fill" && (
          <div className="absolute z-10 mt-2">
            <div
              className="fixed inset-0"
              onClick={() => setShowColorPicker(false)}
            />
            <SketchPicker
              color={element.fill}
              onChange={(color) => handleUpdate({ fill: color.hex })}
              onChangeComplete={() => dispatch(finishUpdateElement())}
            />
          </div>
        )}
      </div>

      {element.shapeType === "rect" && (
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Corner Radius: {element.cornerRadius || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={element.cornerRadius || 0}
            onChange={(e) =>
              handleUpdate({ cornerRadius: parseInt(e.target.value) })
            }
            onMouseUp={() => dispatch(finishUpdateElement())}
            className="w-full accent-blue-500"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      <div className="flex items-center p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-center flex-1 text-gray-800">
          Properties
        </h3>
      </div>

      {element.type === "shape" && renderImageManipulationControls()}

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Transform</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              X Position
            </label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
              onBlur={() => dispatch(finishUpdateElement())}
              className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Y Position
            </label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
              onBlur={() => dispatch(finishUpdateElement())}
              className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onBlur={() => dispatch(finishUpdateElement())}
              className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onBlur={() => dispatch(finishUpdateElement())}
              className="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onMouseUp={() => dispatch(finishUpdateElement())}
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
            onMouseUp={() => dispatch(finishUpdateElement())}
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
