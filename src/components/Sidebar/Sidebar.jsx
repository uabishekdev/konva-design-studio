import React, { Suspense, lazy } from "react";
import { Layers, Image, Video, Shapes, Type } from "lucide-react";

const FramesPanel = lazy(() => import("./FramesPanel"));
const ImagesPanel = lazy(() => import("./ImagesPanel"));
const VideosPanel = lazy(() => import("./VideosPanel"));

const Sidebar = () => {
  const [activeTab, setActiveTab] = React.useState("frames");

  const tabs = [
    { id: "frames", label: "Frames", icon: Layers },
    { id: "images", label: "Images", icon: Image },
    { id: "videos", label: "Videos", icon: Video },
    { id: "shapes", label: "Shapes", icon: Shapes },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case "frames":
        return <FramesPanel />;
      case "images":
        return <ImagesPanel />;
      case "videos":
        return <VideosPanel />;
      default:
        return <div className="p-4">Coming soon...</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          {renderPanel()}
        </Suspense>
      </div>
    </div>
  );
};

export default Sidebar;
