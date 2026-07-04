import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminUIState {
  sidebarOpen: boolean;
}

const initialState: AdminUIState = {
  sidebarOpen: true,
};

const adminUISlice = createSlice({
  name: "admin-ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = adminUISlice.actions;
export default adminUISlice.reducer;
