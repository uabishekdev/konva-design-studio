import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy } from "lucide-react";
import { setSelectedId } from "../../store/slices/canvasSlice";
import {
  deleteElement,
  duplicateElement,
  updateElement,
  finishUpdateElement,
} from "../../store/slices/elementsSlice";

const LayersPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);

  const toggleVisibility = (id, e) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    dispatch(
      updateElement({
        id,
        updates: { visible: element.visible === false ? true : false },
      })
    );
    dispatch(finishUpdateElement());
  };

  const toggleLock = (id, e) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    dispatch(
      updateElement({
        id,
        updates: { locked: !element.locked },
      })
    );
    dispatch(finishUpdateElement());
  };

  const getElementIcon = (type) => {
    switch (type) {
      case "text":
        return "T";
      case "image":
        return "🖼️";
      case "shape":
        return "⬜";
      case "video":
        return "🎬";
      default:
        return "📦";
    }
  };

  const getElementName = (element) => {
    if (element.text) return element.text.substring(0, 20);
    return `${element.type} ${element.id.slice(-4)}`;
  };

  const sortedElements = [...elements]
    .filter((el) => !el.parentId)
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Layers</h3>
        <p className="text-xs text-gray-500 mt-1">
          {sortedElements.length} layer{sortedElements.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sortedElements.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            <div className="text-4xl mb-3">📄</div>
            <p className="font-medium">No layers yet</p>
            <p className="text-xs mt-1">Add elements to see them here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedElements.map((element) => {
              const isSelected = element.id === selectedId;
              const isVisible = element.visible !== false;
              const isLocked = element.locked;

              return (
                <div
                  key={element.id}
                  onClick={() =>
                    !isLocked && dispatch(setSelectedId(element.id))
                  }
                  className={`
                    group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                    ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-md"
                        : "hover:bg-gray-100"
                    }
                    ${isLocked ? "opacity-60" : ""}
                  `}
                >
                  <span className="text-lg">
                    {getElementIcon(element.type)}
                  </span>

                  <span className="flex-1 truncate text-sm font-medium">
                    {getElementName(element)}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleVisibility(element.id, e)}
                      className={`p-1 rounded hover:bg-gray-200 ${
                        isSelected ? "hover:bg-blue-600" : ""
                      }`}
                      title={isVisible ? "Hide" : "Show"}
                    >
                      {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    <button
                      onClick={(e) => toggleLock(element.id, e)}
                      className={`p-1 rounded hover:bg-gray-200 ${
                        isSelected ? "hover:bg-blue-600" : ""
                      }`}
                      title={isLocked ? "Unlock" : "Lock"}
                    >
                      {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(duplicateElement(element.id));
                      }}
                      className={`p-1 rounded hover:bg-gray-200 ${
                        isSelected ? "hover:bg-blue-600" : ""
                      }`}
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this layer?")) {
                          dispatch(deleteElement(element.id));
                        }
                      }}
                      className={`p-1 rounded hover:bg-red-100 text-red-600 ${
                        isSelected ? "hover:bg-red-600 hover:text-white" : ""
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
