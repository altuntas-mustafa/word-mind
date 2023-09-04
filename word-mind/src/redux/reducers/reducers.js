import { createSlice } from "@reduxjs/toolkit";

// Function to read settings from localStorage
const loadSettingsFromLocalStorage = () => {
  try {
    const settings = localStorage.getItem("flashcardsSettings");
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    // Handle errors, if any
  }
  return {
    isRandomOrder: true,
    isFrontDisplayed: true,
  };
};

// Function to save settings to localStorage
const saveSettingsToLocalStorage = (settings) => {
  try {
    localStorage.setItem("flashcardsSettings", JSON.stringify(settings));
  } catch (error) {
    // Handle errors, if any
  }
};

const initialState = loadSettingsFromLocalStorage();

export const flashcardsSlice = createSlice({
  name: "flashcards",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.isRandomOrder = action.payload;
      saveSettingsToLocalStorage(state); // Save updated settings
    },
    setDisplayOrder: (state, action) => {
      state.isFrontDisplayed = action.payload;
      saveSettingsToLocalStorage(state); // Save updated settings
    },
  },
});

export const { setOrder, setDisplayOrder } = flashcardsSlice.actions;

export default flashcardsSlice.reducer;
