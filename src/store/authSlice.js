import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  accessToken: Cookies.get(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`) || null,
  refreshToken: Cookies.get(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`) || null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      Cookies.set(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`, action.payload.accessToken, { expires: 7 });
      Cookies.set(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`, action.payload.refreshToken, { expires: 15 });
    },

    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // Clear cookies
      Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);
      Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
