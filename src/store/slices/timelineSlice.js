import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTime: 0,
  duration: 30,
  isPlaying: false,
  zoom: 1,
  tracks: [],
};

const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
    },
  },
});

export const { setCurrentTime, setDuration, togglePlay, setZoom, addTrack } =
  timelineSlice.actions;

export default timelineSlice.reducer;
