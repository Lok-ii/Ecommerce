import { createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

const initialState = {
  cartItemCount: 1,
  cartItems: [],
  productData : [],
  totalCartAmount: 0,
  singleProduct: {},
  mainImage: "",
  price: 0,
  review : false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCartItemCount: (state, action) => {
      state.cartItemCount = action.payload;
    },
    setCart: (state, action) => {
      if (action.payload.type === "ADDEDTOCART") {
        state.cartItems = [...state.cartItems, action.payload.payload];
        addToCart(state.cartItems, action.payload.payload);
        console.log("called")
      } else if(action.payload.type === "GETDATA") {
        state.cartItems = [...action.payload.payload];
      }else if(action.payload.type === "CLEARDATA"){
        state.cartItems = [];
      }
    },
    setCurrentAsin: (state, action) => {
      state.currentAsin = action.payload;
    },
    setProductData : (state, action) => {
      state.productData = action.payload;
    },
    setTotalCartAmount : (state, action) => {
      state.totalCartAmount = action.payload;
    },
    setSingleProduct : (state, action) => {
      state.singleProduct = action.payload;
    },
    setMainImage: (state, action) => {
      state.mainImage = action.payload;
    },
    setPrice : (state, action) => {
      state.price = action.payload;
    },
    setReview : (state, action) => {
      state.review = action.payload;
    }
  },
});

export const addToCart = async (cartItems, cartAsin) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
      throw new Error("Current user not found or email not provided");
    }

    const docRef = doc(db, "users", currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let updatedCart = [];
      const data = docSnap.data();

      if (data.cart) {
        // Check if the item exists in the cart
        const existingIndex = data.cart.findIndex(item => item.itemId === cartAsin.itemId);
        if (existingIndex !== -1) {
          // Item exists, update its count
          updatedCart = data.cart.map((item, index) => {
            if (index === existingIndex) {
              return { ...item, itemCount: cartAsin.itemCount };
            }
            return item;
          });
        } else {
          // Item does not exist, add new item
          updatedCart = [...data.cart, cartAsin];
        }
      } else {
        // Cart does not exist, create new with the item
        updatedCart = [cartAsin];
      }

      // Update the document with the new or updated cart
      await updateDoc(docRef, { cart: updatedCart });
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const fetchCartData = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
      throw new Error("Current user not found or email not provided");
    }

    const docRef = doc(db, "users", currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().cart) {
      // Return the cart data
      return docSnap.data().cart;
    } else {
      console.log("No cart data found!");
      return [];
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return [];
  }
};

// Thunk action for fetching cart data
export const fetchAndSetCartData = () => async (dispatch) => {
  try {
    const cartData = await fetchCartData();
    dispatch(setCart({ type: "GETDATA", payload: cartData })); // Assuming you have a reducer set up to handle this action
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    // Optionally dispatch an error action or set an error state in your Redux store
  }
};

export const { setCartItemCount, setCart, setCurrentAsin, setProductData, setTotalCartAmount, setSingleProduct, setMainImage, setPrice, setReview } = cartSlice.actions;
export default cartSlice.reducer;
