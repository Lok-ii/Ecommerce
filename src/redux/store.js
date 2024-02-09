import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./headerSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    authentication: authReducer,
    cart: cartReducer,
  },
});
