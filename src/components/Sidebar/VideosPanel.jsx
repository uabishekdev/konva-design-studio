import React from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../store/slices/elementsSlice";
import { Upload } from "lucide-react";

const VideosPanel = () => {
  const dispatch = useDispatch();

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch(
        addElement({
          type: "video",
          src: url,
          x: 300,
          y: 200,
          width: 400,
          height: 300,
          autoPlay: false,
          loop: true,
          isPlaying: false,
        })
      );
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">Videos</h3>

      <label className="w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 cursor-pointer">
        <Upload size={18} />
        Upload Video
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </label>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Upload a video file to add it to your canvas. Supported formats: MP4,
          WebM, OGG
        </p>
      </div>
    </div>
  );
};

export default VideosPanel;
