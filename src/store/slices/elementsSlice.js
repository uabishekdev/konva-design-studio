import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  layers: [],
  history: [[]],
  historyStep: 0,
};

// Helper function to save the current state to history
const addToHistory = (state) => {
  if (state.historyStep < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyStep + 1);
  }
  state.history.push(state.items);
  state.historyStep += 1;
};

const elementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    addElement: (state, action) => {
      const newElement = {
        id: action.payload.id || nanoid(),
        createdAt: Date.now(),
        children: [],
        ...action.payload,
      };
      state.items.push(newElement);
      state.layers.push(newElement.id);
      addToHistory(state);
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        addToHistory(state);
      }
    },
    deleteElement: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.layers = state.layers.filter((layerId) => layerId !== id);
      addToHistory(state);
    },
    addImageToFrame: (state, action) => {
      const { frameId, imageData } = action.payload;
      const frameIndex = state.items.findIndex((item) => item.id === frameId);
      if (frameIndex !== -1) {
        const frame = state.items[frameIndex];
        const imageId = nanoid();
        const imageElement = {
          id: imageId,
          type: "image",
          src: imageData.src,
          parentId: frameId,
          fit: "cover",
          clipShape: frame.clipShape,
          cornerRadius: frame.cornerRadius,
        };
        if (frame.children && frame.children.length > 0) {
          const oldImageId = frame.children[0];
          state.items = state.items.filter((item) => item.id !== oldImageId);
        }
        state.items[frameIndex].children = [imageId];
        state.items.push(imageElement);
        addToHistory(state);
      }
    },
    // New Reducer for toggling video play state
    toggleVideoPlay: (state, action) => {
      const { id } = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === id && item.type === "video"
      );
      if (index !== -1) {
        state.items[index].isPlaying = !state.items[index].isPlaying;
      }
    },
    reorderLayers: (state, action) => {
      state.layers = action.payload;
    },
    duplicateElement: (state, action) => {
      const id = action.payload;
      const element = state.items.find((item) => item.id === id);
      if (element) {
        const newElement = {
          ...element,
          id: nanoid(),
          x: element.x + 20,
          y: element.y + 20,
          createdAt: Date.now(),
        };
        state.items.push(newElement);
        state.layers.push(newElement.id);
        addToHistory(state);
      }
    },
    undo: (state) => {
      if (state.historyStep > 0) {
        state.historyStep -= 1;
        state.items = state.history[state.historyStep];
      }
    },
    redo: (state) => {
      if (state.historyStep < state.history.length - 1) {
        state.historyStep += 1;
        state.items = state.history[state.historyStep];
      }
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  addImageToFrame,
  toggleVideoPlay, // Export the new action
  reorderLayers,
  duplicateElement,
  undo,
  redo,
} = elementsSlice.actions;

export default elementsSlice.reducer;
