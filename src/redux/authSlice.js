import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const initialState = {
  currentUser: {},
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const auth = getAuth();

const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAuthentication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userAuthentication.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        
      })
      .addCase(userAuthentication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const userAuthentication = createAsyncThunk(
  "auth/authAsync",
  async ({ type, email, password }) => {
    try {
      let user = {};

      switch (type) {
        case "SIGNUP":
          const signUpResponse = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          user = signUpResponse.user.providerData[0];
          if (Object.keys(user).length !== 0) {
            setDoc(doc(db, "users", state.currentUser.email), user);
          }
          break;
        case "LOGIN":
          const signInResponse = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          user = signInResponse.user.providerData[0];
          break;
        case "SIGNOUT":
          signOut(auth);
          break;
        default:
          throw new Error("Invalid authentication type");
      }

      return user;
    } catch (error) {
      console.error(error.code, error.message);
    }
  },
);

export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
