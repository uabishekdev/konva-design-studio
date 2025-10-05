import React from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";
import { Upload } from "lucide-react";

const ImagesPanel = () => {
  const dispatch = useDispatch();

  const sampleImages = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(
          addElement({
            type: "image",
            src: event.target.result,
            x: 300,
            y: 200,
            width: 300,
            height: 200,
            fit: "cover",
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addSampleImage = (src) => {
    dispatch(
      addElement({
        type: "image",
        src,
        x: 300,
        y: 200,
        width: 300,
        height: 200,
        fit: "cover",
      })
    );
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Images</h3>

      <label className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer mb-4">
        <Upload size={18} />
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      <h4 className="font-medium text-sm text-gray-700 mb-3">Sample Images</h4>
      <div className="grid grid-cols-2 gap-3">
        {sampleImages.map((src, index) => (
          <button
            key={index}
            onClick={() => addSampleImage(src)}
            className="aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <img
              src={src}
              alt={`Sample ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImagesPanel;
