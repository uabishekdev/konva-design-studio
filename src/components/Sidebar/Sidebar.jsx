import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import {
  Layers as LayersIcon,
  Image,
  Video,
  Type,
  Layout,
  Save,
  Sliders,
} from "lucide-react";

const FramesPanel = lazy(() => import("./FramesPanel"));
const ImagesPanel = lazy(() => import("./ImagesPanel"));
const VideosPanel = lazy(() => import("./VideosPanel"));
const TextPanel = lazy(() => import("./TextPanel"));
const TemplatesPanel = lazy(() => import("./TemplatesPanel"));
const ProjectsPanel = lazy(() => import("./ProjectsPanel"));
const PropertiesPanel = lazy(() => import("./PropertiesPanel"));
const LayersPanel = lazy(() => import("./LayersPanel"));
const EffectsPanel = lazy(() => import("./EffectsPanel"));

const Sidebar = () => {
  const [activeTab, setActiveTab] = React.useState("templates");
  const selectedId = useSelector((state) => state.canvas.selectedId);

  const tabs = [
    { id: "templates", label: "Templates", icon: Layout },
    { id: "layers", label: "Layers", icon: LayersIcon },
    { id: "frames", label: "Frames", icon: LayersIcon },
    { id: "images", label: "Images", icon: Image },
    { id: "videos", label: "Videos", icon: Video },
    { id: "text", label: "Text", icon: Type },
    { id: "effects", label: "Effects", icon: Sliders },
    { id: "projects", label: "Projects", icon: Save },
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case "templates":
        return <TemplatesPanel />;
      case "layers":
        return <LayersPanel />;
      case "frames":
        return <FramesPanel />;
      case "images":
        return <ImagesPanel />;
      case "videos":
        return <VideosPanel />;
      case "text":
        return <TextPanel />;
      case "effects":
        return <EffectsPanel />;
      case "projects":
        return <ProjectsPanel />;
      default:
        return <div className="p-4">Select a tab</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors min-w-max ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={16} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="p-4 flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <div>{renderActivePanel()}</div>

          {selectedId && activeTab !== "layers" && (
            <div className="border-t-4 border-gray-200">
              <PropertiesPanel />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Sidebar;
