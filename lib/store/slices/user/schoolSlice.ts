import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { School } from "@/types";

interface SchoolState {
  currentSchool: School | null;
}

const initialState: SchoolState = {
  currentSchool: {
    id: "sch_001",
    name: "Excellence Academy",
    email: "admin@excellence.edu.ng",
    phone: "08012345678",
    address: "12 School Road, Lagos",
    createdAt: "2024-01-01T00:00:00Z",
  },
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    setCurrentSchool: (state, action: PayloadAction<School>) => {
      state.currentSchool = action.payload;
    },
  },
});

export const { setCurrentSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
