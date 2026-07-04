import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/user/authSlice";
import uiReducer from "./slices/user/uiSlice";
import schoolReducer from "./slices/user/schoolSlice";
import adminUiReducer from "./slices/admin/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    school: schoolReducer,
    adminUi: adminUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
