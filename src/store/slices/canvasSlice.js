import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 1920,
  height: 1080,
  scale: 1,
  selectedId: null,
  backgroundColor: "#ffffff",
  history: [],
  historyStep: 0,
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
      state.selectedId = action.payload;
    },
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload;
    },
    addToHistory: (state, action) => {
      state.history = state.history.slice(0, state.historyStep + 1);
      state.history.push(action.payload);
      state.historyStep += 1;
    },
    undo: (state) => {
      if (state.historyStep > 0) {
        state.historyStep -= 1;
      }
    },
    redo: (state) => {
      if (state.historyStep < state.history.length - 1) {
        state.historyStep += 1;
      }
    },
  },
});

export const {
  setCanvasSize,
  setScale,
  setSelectedId,
  setBackgroundColor,
  addToHistory,
  undo,
  redo,
} = canvasSlice.actions;

export default canvasSlice.reducer;
