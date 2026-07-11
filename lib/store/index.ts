import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/user/authSlice";
import uiReducer from "./slices/user/uiSlice";
import schoolReducer from "./slices/user/schoolSlice";
import adminUiReducer from "./slices/admin/uiSlice";
import studentReducer from "./slices/user/studentSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  school: schoolReducer,
  adminUi: adminUiReducer,
  student: studentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "school", "student"], // items to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
