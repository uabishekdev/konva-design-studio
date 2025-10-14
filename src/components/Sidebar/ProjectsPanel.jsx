import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Trash2, Download, Clock } from "lucide-react";
import { getDesigns, deleteDesign } from "../../utils/localStorage";
import { loadProject } from "../../store/slices/elementsSlice";
import {
  setCanvasSize,
  setBackgroundColor,
} from "../../store/slices/canvasSlice";

const ProjectsPanel = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const savedProjects = getDesigns();
    setProjects(savedProjects);
  };

  const handleLoadProject = (project) => {
    dispatch(
      setCanvasSize({
        width: project.canvasState.width,
        height: project.canvasState.height,
      })
    );
    dispatch(setBackgroundColor(project.canvasState.backgroundColor));
    dispatch(loadProject({ elements: project.elementsState.items }));
  };

  const handleDeleteProject = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this project?")) {
      deleteDesign(id);
      loadProjects();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">My Projects</h3>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No saved projects</p>
          <p className="text-sm text-gray-400">
            Save your designs to access them later
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleLoadProject(project)}
              className="group relative bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {project.canvasState.width} × {project.canvasState.height}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="p-2 rounded hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;
