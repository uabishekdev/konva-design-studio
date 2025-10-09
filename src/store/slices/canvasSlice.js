import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 1920,
  height: 1080,
  scale: 0.5, // Adjusted initial scale
  selectedId: null,
  backgroundColor: "#ffffff",
  exportRequestTimestamp: null,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCanvasSize: (state, action) => {
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    zoom: (state, action) => {
      const newScale = state.scale * action.payload;
      state.scale = Math.max(0.1, Math.min(newScale, 3)); // Clamp scale between 10% and 300%
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload;
    },
    requestExport: (state) => {
      state.exportRequestTimestamp = Date.now();
    },
    clearExportRequest: (state) => {
      state.exportRequestTimestamp = null;
    },
  },
});

export const {
  setCanvasSize,
  setScale,
  zoom,
  setSelectedId,
  setBackgroundColor,
  requestExport,
  clearExportRequest,
} = canvasSlice.actions;

export default canvasSlice.reducer;
