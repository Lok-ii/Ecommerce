import { doc, getDoc } from "firebase/firestore";
import { setCart, setCartItemCount } from "../redux/cartSlice";
import { db } from "../utils/firebase";

export const getDataFromStore = async (dispatch) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        console.log("Current user:", currentUser);

    if (!currentUser || !currentUser.email) {
      throw new Error("Current user not found or email not provided");
    }

    const docRef = doc(db, "users", currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (Object.keys(docSnap.data()).includes("cart")) {
        dispatch(setCart({ type: "GETDATA", payload: docSnap.data().cart }));
        // const itemCount = docSnap.data().cart.filter((ele) => ele.itemId == asin);
        // if (itemCount.length === 0) {
        //   dispatch(setCartItemCount(1));
        // } else {
        //   dispatch(setCartItemCount(itemCount[0].itemCount));
        // }
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};