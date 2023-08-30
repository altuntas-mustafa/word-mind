import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRandomOrder: true,
  isFrontDisplayed: true,
};

export const flashcardsSlice = createSlice({
  name: "flashcards",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.isRandomOrder = action.payload;
    },
    setDisplayOrder: (state, action) => {
      state.isFrontDisplayed = action.payload;
    },
  },
});

export const { setOrder, setDisplayOrder } = flashcardsSlice.actions;

export default flashcardsSlice.reducer;
