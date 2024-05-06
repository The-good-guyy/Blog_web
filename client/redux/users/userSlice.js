import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  deleteToken: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      state.currentUser = action.payload;
    },
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateImage: (state, action) => {
      console.log(action.payload);
      state.currentUser.profilePicture = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateImage,
  updateStart,
  updateFailure,
  updateSuccess,
  fetchUser,
  signoutSuccess,
} = userSlice.actions;
export default userSlice.reducer;
