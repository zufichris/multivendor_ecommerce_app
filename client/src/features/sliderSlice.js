import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
  length: 1,
};
export const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    nextSlide(state, action) {
      state.value = action.payload > state.length ? 0 : action.payload;
    },
    prevSlide(state, action) {
      state.value = action.payload < 0 ? state.length : action.payload;
    },
    dotSlide() {},
  },
});
export const { nextSlide, prevSlide, dotSlide } = sliderSlice.actions;
export default sliderSlice.reducer;
