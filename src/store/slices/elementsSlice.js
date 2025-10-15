import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  layers: [],
  history: [[]],
  historyStep: 0,
  clipboard: null,
  multiSelect: [],
};

const addToHistory = (state) => {
  if (state.historyStep < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyStep + 1);
  }
  state.history.push(JSON.parse(JSON.stringify(state.items)));
  state.historyStep += 1;

  if (state.history.length > 50) {
    state.history = state.history.slice(-50);
    state.historyStep = state.history.length - 1;
  }
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
        visible: true,
        locked: false,
        zIndex: state.items.length,
      };

      let specificProperties = {};
      switch (action.payload.type) {
        case "text":
          specificProperties = {
            text: "Sample Text",
            fontSize: 48,
            fontFamily: "Inter, sans-serif",
            fill: "#000000",
            align: "left",
            verticalAlign: "top",
            fontStyle: "normal",
            textDecoration: "",
            letterSpacing: 0,
            lineHeight: 1.2,
            shadow: null,
            stroke: null,
            strokeWidth: 0,
            ...action.payload,
          };
          break;
        case "shape":
          specificProperties = {
            fill: "#f1f5f9",
            borderColor: "#64748b",
            borderWidth: 2,
            cornerRadius: 0,
            shapeType: "rect",
            gradient: null,
            ...action.payload,
          };
          break;
        case "image":
          specificProperties = {
            filters: [],
            brightness: 0,
            contrast: 0,
            saturation: 0,
            blur: 0,
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

      const element = state.items.find((item) => item.id === id);
      if (element?.children) {
        element.children.forEach((childId) => {
          state.items = state.items.filter((item) => item.id !== childId);
          state.layers = state.layers.filter((layerId) => layerId !== childId);
        });
      }

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
          visible: true,
          locked: false,
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
      state.items = elements.map((el, index) => ({
        ...el,
        id: el.id || nanoid(),
        createdAt: Date.now(),
        visible: el.visible !== false,
        locked: el.locked || false,
        zIndex: index,
      }));
      state.layers = state.items.map((el) => el.id);
      state.history = [JSON.parse(JSON.stringify(state.items))];
      state.historyStep = 0;
      state.multiSelect = [];
    },

    loadProject: (state, action) => {
      const { elements } = action.payload;
      state.items = elements;
      state.layers = elements.map((el) => el.id);
      state.history = [JSON.parse(JSON.stringify(state.items))];
      state.historyStep = 0;
      state.multiSelect = [];
    },

    clearCanvas: (state) => {
      state.items = [];
      state.layers = [];
      state.history = [[]];
      state.historyStep = 0;
      state.multiSelect = [];
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
      state.layers.forEach((layerId, index) => {
        const itemIndex = state.items.findIndex((item) => item.id === layerId);
        if (itemIndex !== -1) {
          state.items[itemIndex].zIndex = state.layers.length - index;
        }
      });
      addToHistory(state);
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
          zIndex: state.items.length,
        };
        state.items.push(newElement);
        state.layers.push(newElement.id);
        addToHistory(state);
      }
    },

    copyElement: (state, action) => {
      const id = action.payload;
      const element = state.items.find((item) => item.id === id);
      if (element) {
        state.clipboard = JSON.parse(JSON.stringify(element));
      }
    },

    pasteElement: (state) => {
      if (state.clipboard) {
        const newElement = {
          ...state.clipboard,
          id: nanoid(),
          x: state.clipboard.x + 20,
          y: state.clipboard.y + 20,
          createdAt: Date.now(),
          zIndex: state.items.length,
        };
        state.items.push(newElement);
        state.layers.push(newElement.id);
        addToHistory(state);
      }
    },

    bringToFront: (state, action) => {
      const id = action.payload;
      const maxZIndex = Math.max(...state.items.map((el) => el.zIndex || 0));
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].zIndex = maxZIndex + 1;
      }
      addToHistory(state);
    },

    sendToBack: (state, action) => {
      const id = action.payload;
      const minZIndex = Math.min(...state.items.map((el) => el.zIndex || 0));
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].zIndex = minZIndex - 1;
      }
      addToHistory(state);
    },

    bringForward: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].zIndex = (state.items[index].zIndex || 0) + 1;
      }
      addToHistory(state);
    },

    sendBackward: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index].zIndex = (state.items[index].zIndex || 0) - 1;
      }
      addToHistory(state);
    },

    setMultiSelect: (state, action) => {
      state.multiSelect = action.payload;
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
  copyElement,
  pasteElement,
  bringToFront,
  sendToBack,
  bringForward,
  sendBackward,
  setMultiSelect,
  undo,
  redo,
} = elementsSlice.actions;

export default elementsSlice.reducer;
