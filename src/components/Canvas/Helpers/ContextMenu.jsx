import React from "react";
import { useDispatch } from "react-redux";
import { Copy, Clipboard, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  deleteElement,
  duplicateElement,
  copyElement,
  bringToFront,
  sendToBack,
  bringForward,
  sendBackward,
} from "../../../store/slices/elementsSlice";

const ContextMenu = ({ x, y, elementId, onClose }) => {
  const dispatch = useDispatch();

  const handleAction = (action) => {
    switch (action) {
      case "duplicate":
        dispatch(duplicateElement(elementId));
        break;
      case "copy":
        dispatch(copyElement(elementId));
        break;
      case "delete":
        dispatch(deleteElement(elementId));
        break;
      case "bringToFront":
        dispatch(bringToFront(elementId));
        break;
      case "sendToBack":
        dispatch(sendToBack(elementId));
        break;
      case "bringForward":
        dispatch(bringForward(elementId));
        break;
      case "sendBackward":
        dispatch(sendBackward(elementId));
        break;
      default:
        break;
    }
    onClose();
  };

  const menuItems = [
    { icon: Copy, label: "Duplicate", action: "duplicate", shortcut: "Ctrl+D" },
    { icon: Clipboard, label: "Copy", action: "copy", shortcut: "Ctrl+C" },
    { divider: true },
    { icon: ArrowUp, label: "Bring to Front", action: "bringToFront" },
    { icon: ArrowUp, label: "Bring Forward", action: "bringForward" },
    { icon: ArrowDown, label: "Send Backward", action: "sendBackward" },
    { icon: ArrowDown, label: "Send to Back", action: "sendToBack" },
    { divider: true },
    {
      icon: Trash2,
      label: "Delete",
      action: "delete",
      shortcut: "Del",
      danger: true,
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[220px]"
        style={{ left: x, top: y }}
      >
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="h-px bg-gray-200 my-1" />;
          }

          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => handleAction(item.action)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between gap-3 ${
                item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-gray-400">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ContextMenu;
