import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addElement, addImageToFrame } from "../../store/slices/elementsSlice";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";

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
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
  ];

  const handleImageClick = (src) => {
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
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Images</h3>

        <label className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-xl mb-4">
          <Upload size={28} strokeWidth={2.5} />
          <div className="text-center">
            <div className="font-bold text-lg">Upload Photo</div>
            <div className="text-xs text-blue-100">Click to browse</div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {isFrameSelected ? (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-900 font-bold">
                Frame Selected!
              </p>
            </div>
            <p className="text-xs text-green-700 mb-2">
              Upload button will add photo to selected frame
            </p>
            <div className="text-xs text-green-600 bg-white/50 rounded px-2 py-1">
              Frame ID: #{selectedId.slice(-6)}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={18}
                className="text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  No Frame Selected
                </p>
                <p className="text-xs text-amber-700">
                  Select a frame first, or upload to add image directly to
                  canvas
                </p>
              </div>
            </div>
          </div>
        )}

        <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
          <ImageIcon size={16} />
          Sample Images
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {sampleImages.map((src, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(src)}
              className="relative aspect-square rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:scale-105 hover:ring-4 hover:ring-blue-300 group"
            >
              <img
                src={src}
                alt={`Sample ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <ImageIcon className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagesPanel;
