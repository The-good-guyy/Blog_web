import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import userReducer from "./users/userSlice";
import themeReducer from "./theme/themeSlice";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import persistStore from "redux-persist/es/persistStore";
const rootReducer = combineReducers({ user: userReducer, theme: themeReducer });
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistReducers = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: {
    user: persistReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
