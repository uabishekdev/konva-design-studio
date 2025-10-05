import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  layers: [],
};

const elementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    addElement: (state, action) => {
      const newElement = {
        id: nanoid(),
        ...action.payload,
        createdAt: Date.now(),
      };
      state.items.push(newElement);
      state.layers.push(newElement.id);
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    deleteElement: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.layers = state.layers.filter((layerId) => layerId !== id);
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
      }
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  reorderLayers,
  duplicateElement,
} = elementsSlice.actions;

export default elementsSlice.reducer;
