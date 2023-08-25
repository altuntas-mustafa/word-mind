import { configureStore } from "@reduxjs/toolkit";
import flashcardsReducer from "./reducers";

const store = configureStore({
  reducer: {
    flashcards: flashcardsReducer,
  },
});

export default store;
