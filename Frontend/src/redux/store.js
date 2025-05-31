import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { slice } from "./slice/slice";
import logger from "redux-logger";
import { localStoragekeys } from "@/imports/mainExports";

function loadFromLocalStorage() {
  try {
    const serialState = localStorage.getItem(localStoragekeys.userState);
    if (serialState === null) return undefined;
    return JSON.parse(serialState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

function saveToLocalStorage(state) {
  try {
    const storage = JSON.stringify(state);
    localStorage.setItem(localStoragekeys.userState, storage);
  } catch (e) {
    console.warn(e);
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    [slice.reducerPath]: slice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(slice.middleware, logger),
  preloadedState: loadFromLocalStorage(),
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
