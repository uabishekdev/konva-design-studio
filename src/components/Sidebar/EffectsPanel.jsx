import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateElement,
  finishUpdateElement,
} from "../../store/slices/elementsSlice";
import { Sparkles, Droplet, Sun, Contrast, Blend } from "lucide-react";

const EffectsPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);
  const element = elements.find((item) => item.id === selectedId);

  const handleUpdate = (updates) => {
    if (!selectedId) return;
    dispatch(updateElement({ id: selectedId, updates }));
  };

  const handleUpdateFinish = () => {
    dispatch(finishUpdateElement());
  };

  if (!element) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Sparkles className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="font-medium">No element selected</p>
        <p className="text-sm mt-1">Select an element to apply effects</p>
      </div>
    );
  }

  if (element.type !== "image" && element.type !== "shape") {
    return (
      <div className="p-8 text-center text-gray-500">
        <Sparkles className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="font-medium">Effects not available</p>
        <p className="text-sm mt-1">
          Select an image or shape to apply effects
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Sparkles size={20} className="text-purple-600" />
        Visual Effects
      </h3>

      <div className="space-y-6">
        {/* Blur Effect */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Droplet size={18} className="text-blue-600" />
            <label className="text-sm font-semibold text-gray-800">Blur</label>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={element.blur || 0}
            onChange={(e) =>
              handleUpdate({
                blur: parseInt(e.target.value),
                blurRadius: parseInt(e.target.value),
              })
            }
            onMouseUp={handleUpdateFinish}
            className="w-full accent-blue-500"
          />
          <div className="text-xs text-gray-600 mt-1 text-right">
            {element.blur || 0}px
          </div>
        </div>

        {/* Brightness */}
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} className="text-yellow-600" />
            <label className="text-sm font-semibold text-gray-800">
              Brightness
            </label>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.brightness || 0}
            onChange={(e) =>
              handleUpdate({ brightness: parseInt(e.target.value) })
            }
            onMouseUp={handleUpdateFinish}
            className="w-full accent-yellow-500"
          />
          <div className="text-xs text-gray-600 mt-1 text-right">
            {element.brightness > 0 ? "+" : ""}
            {element.brightness || 0}
          </div>
        </div>

        {/* Contrast */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2 border-gray-300">
          <div className="flex items-center gap-2 mb-3">
            <Contrast size={18} className="text-gray-700" />
            <label className="text-sm font-semibold text-gray-800">
              Contrast
            </label>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.contrast || 0}
            onChange={(e) =>
              handleUpdate({ contrast: parseInt(e.target.value) })
            }
            onMouseUp={handleUpdateFinish}
            className="w-full accent-gray-600"
          />
          <div className="text-xs text-gray-600 mt-1 text-right">
            {element.contrast > 0 ? "+" : ""}
            {element.contrast || 0}
          </div>
        </div>

        {/* Saturation */}
        <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200">
          <div className="flex items-center gap-2 mb-3">
            <Blend size={18} className="text-pink-600" />
            <label className="text-sm font-semibold text-gray-800">
              Saturation
            </label>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={element.saturation || 0}
            onChange={(e) =>
              handleUpdate({ saturation: parseInt(e.target.value) })
            }
            onMouseUp={handleUpdateFinish}
            className="w-full accent-pink-500"
          />
          <div className="text-xs text-gray-600 mt-1 text-right">
            {element.saturation > 0 ? "+" : ""}
            {element.saturation || 0}
          </div>
        </div>

        {/* Grayscale Toggle */}
        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-400">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-700"></div>
              <span className="text-sm font-semibold text-gray-800">
                Grayscale Filter
              </span>
            </div>
            <input
              type="checkbox"
              checked={element.filters?.includes("Grayscale")}
              onChange={(e) => {
                const filters = e.target.checked
                  ? [...(element.filters || []), "Grayscale"]
                  : (element.filters || []).filter((f) => f !== "Grayscale");
                handleUpdate({ filters });
                handleUpdateFinish();
              }}
              className="w-6 h-6 accent-gray-700"
            />
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            handleUpdate({
              blur: 0,
              brightness: 0,
              contrast: 0,
              saturation: 0,
              filters: [],
              blurRadius: 0,
            });
            handleUpdateFinish();
          }}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
        >
          Reset All Effects
        </button>
      </div>
    </div>
  );
};

export default EffectsPanel;
