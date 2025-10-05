import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./slices/canvasSlice";
import elementsReducer from "./slices/elementsSlice";
import timelineReducer from "./slices/timelineSlice";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    elements: elementsReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
