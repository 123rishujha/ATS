import { createSlice } from "@reduxjs/toolkit";
import { localStoragekeys } from "../../imports/mainExports";

const initialState = {
  userState: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.userState = action.payload;
    },
    userStateUpdate: (state, action) => {
      state.userState = { ...(state.userState || {}), ...action.payload };
    },
    userLogout: (state) => {
      state.userState = null;
    },
  },
});

const { userLogin, userLogout, userStateUpdate } = userSlice.actions;
const userReducer = userSlice.reducer;

export { userLogin, userLogout, userStateUpdate, userReducer };
