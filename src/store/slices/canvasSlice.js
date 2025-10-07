import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 1920,
  height: 1080,
  scale: 1,
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
    setSelectedId: (state, action) => {
      console.log(" SET SELECTED ID:", action.payload);
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
  setSelectedId,
  setBackgroundColor,
  requestExport,
  clearExportRequest,
} = canvasSlice.actions;

export default canvasSlice.reducer;
