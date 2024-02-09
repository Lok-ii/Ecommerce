import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: false,
  userHeight: true,
  expandSearch: false,
  isLoggedIn: false,
};

const headerSlice = createSlice({
  name: "header",
  initialState: initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setUserHeight: (state, action) => {
      state.userHeight = action.payload;
    },
    setSearchShow: (state, action) => {
      state.expandSearch = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    }
  },
});

export const  { setMode, setUserHeight, setSearchShow, setLoggedIn } = headerSlice.actions;

export default headerSlice.reducer;