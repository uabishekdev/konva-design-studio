import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement, addImageToFrame } from "../../store/slices/elementsSlice";
import { Upload } from "lucide-react";

const ImagesPanel = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.canvas.selectedId);
  const elements = useSelector((state) => state.elements.items);
  const selectedElement = elements.find((el) => el.id === selectedId);


  const sampleImages = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400",
  ];

  const handleImageClick = (src) => {
    console.log(" Image clicked:", src);

    if (selectedId && selectedElement?.type === "shape") {
      console.log("➕ Adding image to frame");
      dispatch(
        addImageToFrame({
          frameId: selectedId,
          imageData: { src },
        })
      );
    } else {
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
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target.result;
        if (selectedId && selectedElement?.type === "shape") {
          dispatch(
            addImageToFrame({
              frameId: selectedId,
              imageData: { src },
            })
          );
        } else {
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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isFrameSelected = selectedId && selectedElement?.type === "shape";

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

      {isFrameSelected && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">
            Frame selected - Click image to add
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Shape: {selectedElement.clipShape || "none"}
          </p>
        </div>
      )}

      <h4 className="font-medium text-sm text-gray-700 mb-3">Sample Images</h4>
      <div className="grid grid-cols-2 gap-3">
        {sampleImages.map((src, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(src)}
            className="aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-blue-500"
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
