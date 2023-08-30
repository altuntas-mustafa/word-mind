import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  displayName: "",
  email: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, displayName, email } = action.payload;
      state.id = id;
      state.displayName = displayName;
      state.email = email;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.id = null;
      state.displayName = "";
      state.email = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
