import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { templates, templateCategories } from "../../data/templates";
import { loadTemplate } from "../../store/slices/elementsSlice";
import {
  setCanvasSize,
  setBackgroundColor,
} from "../../store/slices/canvasSlice";

const TemplatesPanel = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template) => {
    dispatch(
      setCanvasSize({
        width: template.canvas.width,
        height: template.canvas.height,
      })
    );
    dispatch(setBackgroundColor(template.canvas.backgroundColor));
    dispatch(loadTemplate({ elements: template.elements }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-3">Templates</h3>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 p-4 border-b overflow-x-auto">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {templateCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold text-lg mb-1">
                    {template.name}
                  </h4>
                  <p className="text-white/80 text-sm">Click to use</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPanel;
