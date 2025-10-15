import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 1920,
  height: 1080,
  scale: 0.5,
  selectedId: null,
  backgroundColor: "#ffffff",
  exportRequestTimestamp: null,
  showGrid: false,
  snapToGrid: false,
  gridSize: 20,
  showRulers: false,
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
      state.scale = Math.max(0.1, Math.min(newScale, 3));
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
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },
    toggleRulers: (state) => {
      state.showRulers = !state.showRulers;
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
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  toggleRulers,
} = canvasSlice.actions;

export default canvasSlice.reducer;
