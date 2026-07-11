import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { School } from "@/types";

interface SchoolState {
  currentSchool: School | null;
}

const initialState: SchoolState = {
  currentSchool: null,
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    setCurrentSchool: (state, action: PayloadAction<School | null>) => {
      state.currentSchool = action.payload;
    },
    clearCurrentSchool: (state) => {
      state.currentSchool = null;
    },
  },
});

export const { setCurrentSchool, clearCurrentSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
