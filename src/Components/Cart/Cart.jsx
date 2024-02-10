import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setCurrentAsin,
  setProductData,
  setTotalCartAmount,
} from "../../redux/cartSlice";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { getDataFromStore } from "../../utils/getDataFromStore";
import { NavLink } from "react-router-dom";

const Cart = memo(() => {
  const apiKey = import.meta.env.MODE === "PROD" ?  process.env.AMAZON_ASIN : import.meta.env.VITE_AMAZON_ASIN;

  const dispatch = useDispatch();
  const { cartItems, currentAsin, productData, totalCartAmount } = useSelector(
    (state) => state.cart,
  );

  const { isLoggedIn } = useSelector((state) => state.header);

  console.log(cartItems);

  useEffect(() => {
    getDataFromStore(dispatch);
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCartProductData = async () => {
      const fetchedData = await Promise.all(
        cartItems.map(async (item) => {
          const params = {
            api_key: apiKey,
            amazon_domain: "amazon.in",
            asin: item.itemId,
            type: "product",
          };

          try {
            const response = await axios.get(
              "https://api.asindataapi.com/request",
              { params },
            );
            // console.log(response);
            console.log({ ...response.data, itemCount: item.itemCount });
            return { ...response.data, itemCount: item.itemCount };
          } catch (error) {
            console.error(error);
            return null;
          }
        }),
      );

      dispatch(setProductData(fetchedData));
      const total = fetchedData.reduce((acc, item) => {
        if (item && item.product.buybox_winner.price.value) {
          const price = item.product.buybox_winner.price.value;
          return acc + price * item.itemCount;
        }
        return acc;
      }, 0);
      dispatch(setTotalCartAmount(totalCartAmount + total));
    };

    if (cartItems.length > 0) {
      fetchCartProductData();
    }

    return () => {
      dispatch(setProductData([]));
      dispatch(setTotalCartAmount(0));
    };
  }, [cartItems, dispatch]);

  const shipping = totalCartAmount > 0 ? 100 : 0;

  return (
    <section className="h-full bg-gray-100 py-12 sm:py-0 lg:py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
        </div>
        <div className="mx-auto mt-8 max-w-2xl md:mt-12">
          <div className="bg-white shadow">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                <ul className="-my-8">
                  {productData ? (
                    productData &&
                    productData.map((item) => {
                      return (
                        <li
                          key={item.product.asin}
                          className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                        >
                          <div className="shrink-0">
                            <img
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                              src={item.product.main_image.link}
                              alt={item.product.title}
                            />
                          </div>
                          <div className="relative flex flex-1 flex-col justify-between">
                            <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                              <div className="pr-8 sm:pr-5">
                                <p className="text-base font-semibold text-gray-900">
                                  {item.product.title}
                                </p>
                              </div>
                              <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                                  {item.product.buybox_winner.price.raw}
                                </p>
                                <div className="sm:order-1">
                                  <div className="mx-auto flex h-8 items-stretch text-gray-600">
                                    {/* Implement decrement functionality */}
                                    <button
                                      onClick={() => {
                                        // Decrement item count logic here
                                      }}
                                      className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                                    >
                                      -
                                    </button>
                                    <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">
                                      {item.itemCount}
                                    </div>
                                    {/* Implement increment functionality */}
                                    <button
                                      onClick={() => {
                                        // Increment item count logic here
                                      }}
                                      className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                              <button
                                type="button"
                                className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
                                onClick={() => {
                                  // Add logic to remove item from cart
                                }}
                              >
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <ShimmerContentBlock
                      title
                      text
                      cta
                      thumbnailWidth={370}
                      thumbnailHeight={370}
                    />
                  )}
                </ul>
              </div>
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Subtotal</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{totalCartAmount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Shipping</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{shipping}.00
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  <span className="text-xs font-normal text-gray-400">₹</span>{" "}
                  {totalCartAmount + shipping}
                </p>
              </div>
              <div className="mt-6 text-center">
                <NavLink to={"/checkout"}>
                  <button
                    type="button"
                    className="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                  >
                    Checkout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:ml-8 ml-4 h-6 w-6 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Cart;
