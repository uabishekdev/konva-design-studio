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
        id: action.payload.id || nanoid(),
        createdAt: Date.now(),
        children: [],
        ...action.payload,
      };
      console.log(" ADD ELEMENT:", newElement);
      state.items.push(newElement);
      state.layers.push(newElement.id);
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        console.log(" UPDATE ELEMENT:", state.items[index]);
      }
    },
    deleteElement: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.layers = state.layers.filter((layerId) => layerId !== id);
      console.log(" DELETE ELEMENT:", id);
    },
    addImageToFrame: (state, action) => {
      const { frameId, imageData } = action.payload;
      console.log(" ADD IMAGE TO FRAME:", { frameId, imageData });

      const frameIndex = state.items.findIndex((item) => item.id === frameId);
      console.log(" Frame index:", frameIndex);

      if (frameIndex !== -1) {
        const frame = state.items[frameIndex];
        console.log(" Found frame:", frame);

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
          console.log(" Removing old image:", oldImageId);
          state.items = state.items.filter((item) => item.id !== oldImageId);
        }

        state.items[frameIndex].children = [imageId];
        state.items.push(imageElement);
      } else {
        console.error(" Frame not found!");
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
      }
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  addImageToFrame,
  reorderLayers,
  duplicateElement,
} = elementsSlice.actions;

export default elementsSlice.reducer;
