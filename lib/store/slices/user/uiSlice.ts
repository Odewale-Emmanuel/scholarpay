import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  dashboardDateRange: string;
  dashboardFilter: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  dashboardDateRange: "30d",
  dashboardFilter: "all",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setDashboardDateRange: (state, action: PayloadAction<string>) => {
      state.dashboardDateRange = action.payload;
    },
    setDashboardFilter: (state, action: PayloadAction<string>) => {
      state.dashboardFilter = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setDashboardDateRange, setDashboardFilter } =
  uiSlice.actions;
export default uiSlice.reducer;
