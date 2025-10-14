import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  layers: [],
  history: [[]],
  historyStep: 0,
};

const addToHistory = (state) => {
  if (state.historyStep < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyStep + 1);
  }
  state.history.push(JSON.parse(JSON.stringify(state.items)));
  state.historyStep += 1;
};

const elementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    addElement: (state, action) => {
      const baseProperties = {
        id: action.payload.id || nanoid(),
        createdAt: Date.now(),
        children: [],
        rotation: 0,
        opacity: 1,
      };

      let specificProperties = {};
      switch (action.payload.type) {
        case "text":
          specificProperties = {
            text: "Sample Text",
            fontSize: 48,
            fontFamily: "sans-serif",
            fill: "#000000",
            align: "left",
            verticalAlign: "top",
            ...action.payload,
          };
          break;
        default:
          specificProperties = action.payload;
      }

      const newElement = { ...baseProperties, ...specificProperties };
      state.items.push(newElement);
      state.layers.push(newElement.id);
      addToHistory(state);
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    finishUpdateElement: (state) => {
      addToHistory(state);
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
          clipShape: frame.shapeType,
          cornerRadius: frame.cornerRadius,
          opacity: 1,
          rotation: 0,
          imageOffset: { x: 0, y: 0 },
          imageScale: 1,
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
    loadTemplate: (state, action) => {
      const { elements } = action.payload;
      state.items = elements.map((el) => ({
        ...el,
        id: el.id || nanoid(),
        createdAt: Date.now(),
      }));
      state.layers = state.items.map((el) => el.id);
      state.history = [JSON.parse(JSON.stringify(state.items))];
      state.historyStep = 0;
    },
    loadProject: (state, action) => {
      const { elements } = action.payload;
      state.items = elements;
      state.layers = elements.map((el) => el.id);
      state.history = [JSON.parse(JSON.stringify(state.items))];
      state.historyStep = 0;
    },
    clearCanvas: (state) => {
      state.items = [];
      state.layers = [];
      state.history = [[]];
      state.historyStep = 0;
    },
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
        state.items = JSON.parse(
          JSON.stringify(state.history[state.historyStep])
        );
      }
    },
    redo: (state) => {
      if (state.historyStep < state.history.length - 1) {
        state.historyStep += 1;
        state.items = JSON.parse(
          JSON.stringify(state.history[state.historyStep])
        );
      }
    },
  },
});

export const {
  addElement,
  updateElement,
  finishUpdateElement,
  deleteElement,
  addImageToFrame,
  loadTemplate,
  loadProject,
  clearCanvas,
  toggleVideoPlay,
  reorderLayers,
  duplicateElement,
  undo,
  redo,
} = elementsSlice.actions;

export default elementsSlice.reducer;
