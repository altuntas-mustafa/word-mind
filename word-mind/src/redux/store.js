import { configureStore } from "@reduxjs/toolkit";
import flashcardsReducer from "./reducers/reducers";
import userReducer from "./reducers/user";

const store = configureStore({
  reducer: {
    flashcards: flashcardsReducer,
    user: userReducer,
  },
});

export default store;
