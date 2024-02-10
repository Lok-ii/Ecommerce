import { useState } from "react";
import "./App.css";
import Header from "./Components/Layout/Header";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Components/HomePage/Home";
import Shop from "./Components/Shop/Shop";
import Contact from "./Components/Contact/Contact";
import Layout from "./Components/Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Signup from "./Components/LoginSignup/Signup";
import Login from "./Components/LoginSignup/Login";
import firebase from "./utils/firebase";
import ProductPage from "./Components/Product/ProductPage";
import Cart from "./Components/Cart/Cart";
import Checkout from "./Components/Cart/Checkout";

function App() {
  document.title ="ExpressBuy"
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "shop",
          element: <Shop />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "signup",
          element: <Signup />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "product/:asin",
          element: <ProductPage />
        },
        {
          path: "cart",
          element: <Cart />
        },
        {
          path: "checkout",
          element: <Checkout />
        }
      ],
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
