import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentInfo } from "@/app/(admin)/students/_resources/api/create-student";

interface StudentState {
  selectedStudent: StudentInfo | null;
}

const initialState: StudentState = {
  selectedStudent: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<StudentInfo | null>) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
});

export const { setSelectedStudent, clearSelectedStudent } =
  studentSlice.actions;
export default studentSlice.reducer;
