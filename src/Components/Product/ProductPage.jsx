import React, { memo, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Rating } from "@smastrom/react-rating";
import plusSvg from "../../assets/Images/icon-plus.svg";
import minusSvg from "../../assets/Images/icon-minus.svg";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import {
  setCart,
  setCartItemCount,
  setSingleProduct,
  setMainImage,
  setTotalCartAmount,
  setPrice,
  setReview,
} from "../../redux/cartSlice";
import { addToCart } from "../../redux/cartSlice";
import { getDataFromStore } from "../../utils/getDataFromStore";
import axios from "axios";
import {
  ShimmerThumbnail,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import parse from "html-react-parser";
import { FaCircleUser } from "react-icons/fa6";
import ProgressBar from "react-bootstrap/ProgressBar";
// import productdata from "../../assets/ProductData/SingleProduct.json";

const apiKey = import.meta.env.VITE_API_KEY;

const ProductPage = memo(() => {
  const param = useParams();
  const dispatch = useDispatch();
  const { cartItemCount, cartItems, singleProduct, mainImage, price, review } =
    useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.header.isLoggedIn);

  // dispatch(setSingleProduct(productdata));
  // console.log(param.asin);

  useEffect(() => {
    let i = 0;
    const fetchProductData = async () => {
      console.log(param.asin);
      const params = {
        api_key: apiKey,
        amazon_domain: "amazon.in",
        asin: param.asin,
        type: "product",
      };

      try {
        const response = await axios.get(
          "https://api.asindataapi.com/request",
          { params },
        );
        // console.log(response);
        console.log({ ...response.data, itemCount: cartItems[i]?.itemCount });
        dispatch(
          setSingleProduct({
            ...response.data,
            itemCount: cartItems[i]?.itemCount,
          }),
        );
        dispatch(setMainImage(response.data.product.main_image.link));

        const price =
          response.data.product.buybox_winner.price.raw ||
          response.data.product.buybox_winner.rrp.raw;
        dispatch(setPrice(price));
        i++;
        // return { ...response.data, cartItemCount };
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    fetchProductData();

    return () => {
      dispatch(setSingleProduct({}));
      dispatch(setMainImage(""));
      dispatch(setPrice(0));
    };
  }, [param.asin]);

  useEffect(() => {
    getDataFromStore(dispatch);
  }, [isLoggedIn]);

  return Object.keys(singleProduct).length !== 0 ? (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <nav className="flex">
          <ol role="list" className="flex items-center">
            <li className="text-left">
              <div className="-m-1">
                <NavLink
                  to={"/"}
                  className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                >
                  {" "}
                  Home{" "}
                </NavLink>
              </div>
            </li>

            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <a
                    href="#"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                  >
                    {" "}
                    Products{" "}
                  </a>
                </div>
              </div>
            </li>

            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <a
                    href="#"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    aria-current="page"
                  >
                    {" "}
                    {param.asin}{" "}
                  </a>
                </div>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="w-full md:w-[60%]">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg transition-all">
                    <img
                      className="h-full w-full max-w-full object-cover transition-all"
                      src={mainImage}
                      alt=""
                    />
                  </div>
                </div>
                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0 overflow-y-scroll h-[37.5rem]">
                  <div className="flex flex-col items-start lg:flex-col">
                    {singleProduct.product.images.map((itemImage, idx) => {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onMouseEnter={() =>
                            dispatch(setMainImage(itemImage.link))
                          }
                          className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                        >
                          <img
                            className="h-full w-full object-cover"
                            src={itemImage.link}
                            alt=""
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex flex-col w-full md:w-[40%] gap-4">
              <h1 className="w-full font-bold text-gray-900 sm:text-xl">
                {singleProduct.product.title}
              </h1>

              <div className="flex flex-col gap-12">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Rating
                      readOnly
                      value={singleProduct.product.rating}
                      style={{ maxWidth: 100, color: "#FEF08A" }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {singleProduct.product.rating}
                  </p>
                </div>

                <div className="flex rounded-lg w-[30%] py-2 justify-center bg-gray-100 gap-4 items-center">
                  <button
                    className=" rounded-sm "
                    disabled={cartItemCount === 1}
                    onClick={() => {
                      dispatch(setCartItemCount(cartItemCount - 1));
                    }}
                  >
                    <img src={minusSvg} alt="" />
                  </button>
                  <span className="">{cartItemCount}</span>

                  <button
                    className="rounded-sm bg-gray-100"
                    onClick={() => {
                      dispatch(setCartItemCount(cartItemCount + 1));
                    }}
                  >
                    <img src={plusSvg} alt="" />
                  </button>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-xl font-bold">{price}</h1>
                </div>

                <button
                  type="button"
                  className="w-[30%] flex py-2 items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                  onClick={() =>
                    // addToCart(dispatch, cartItems, param.asin, cartItemCount)
                    dispatch(
                      setCart({
                        type: "ADDEDTOCART",
                        payload: {
                          itemCount: cartItemCount,
                          itemId: param.asin,
                        },
                      }),
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0 mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to cart
                </button>
              </div>

              <ul className="mt-8 space-y-2">
                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  <svg
                    className="mr-2 block h-5 w-5 align-middle text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className=""
                    ></path>
                  </svg>
                  Shipping Available Worldwide
                </li>

                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  <svg
                    className="mr-2 block h-5 w-5 align-middle text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      className=""
                    ></path>
                  </svg>
                  Cancel Anytime
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-b border-gray-300">
              <nav className="flex gap-4">
                <button
                  onClick={() => dispatch(setReview(!review))}
                  href="#"
                  title=""
                  className={`${review ? "border-none text-gray-600" : "border-b-2 border-gray-900 text-gray-900"}   py-4 text-sm font-medium  hover:border-gray-400 hover:text-gray-800`}
                >
                  {" "}
                  Description{" "}
                </button>

                <button
                  onClick={() => dispatch(setReview(!review))}
                  href="#"
                  title=""
                  className={`${!review ? "border-none text-gray-600" : "border-b-2 border-gray-900 text-gray-900"} inline-flex items-center py-4 text-sm font-medium`}
                >
                  Top Reviews
                </button>
              </nav>
            </div>

            {!review ? (
              <div className="mt-8 flow-root sm:mt-12">
                {singleProduct.product.feature_bullets && (
                  <h1 className="text-3xl font-bold">Features</h1>
                )}
                <ul className="mt-4 list-decimal flex flex-col gap-2">
                  {singleProduct.product.feature_bullets &&
                    singleProduct.product.feature_bullets.map((feature) => {
                      return <li>{feature}</li>;
                    })}
                </ul>
                <h1 className="mt-8 text-3xl font-bold">Specifications</h1>
                <div className="mt-4 w-full flex flex-col">
                  {singleProduct.product.specifications.map((specs) => {
                    return (
                      <div className="w-full flex items-center py-2 gap-4 border-y justify-between">
                        <span className="w-[30%] font-semibold">
                          {specs.name}
                        </span>{" "}
                        : <span className="w-[70%]">{specs.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="w-full bg-gray-50">
                  {/* Reviews */}
                  <div className="max-w-screen-sm pt-6">
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex flex-col sm:flex-row justify-between items-center">
                        <h1 className="max-w-sm text-2xl font-bold text-blue-900">
                          Average user Rating
                        </h1>
                        <div className="rounded-xl bg-white py-2 px-4 shadow flex flex-col">
                          <div className="flex items-center gap-4 text-xl font-bold text-blue-900">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 text-[#FFB23F]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <p>{singleProduct.rating}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            Average User Rating
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-700 flex flex-col gap-4 items-center w-full">
                        <ul className="flex flex-col items-center gap-2 space-y-2 w-full">
                          <li className="flex items-center gap-4 text-sm font-medium">
                            <span className="w-3">5</span>
                            <span className="mr-4 text-[#FFB23F]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="w-96 overflow-hidden rounded-full bg-gray-300">
                              <ProgressBar
                                variant="warning"
                                now={
                                  singleProduct.product.rating_breakdown
                                    .five_star.percentage
                                }
                              ></ProgressBar>
                            </div>
                            <span className="w-3">
                              {
                                singleProduct.product.rating_breakdown.five_star
                                  .count
                              }
                            </span>
                          </li>
                          <li className="flex items-center gap-4 text-sm font-medium">
                            <span className="w-3">4</span>
                            <span className="mr-4 text-[#FFB23F]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="w-96 overflow-hidden rounded-full bg-gray-300">
                              <ProgressBar
                                variant="warning"
                                now={
                                  singleProduct.product.rating_breakdown
                                    .four_star.percentage
                                }
                              ></ProgressBar>
                            </div>
                            <span className="w-3">
                              {
                                singleProduct.product.rating_breakdown.four_star
                                  .count
                              }
                            </span>
                          </li>
                          <li className="flex items-center gap-4 text-sm font-medium">
                            <span className="w-3">3</span>
                            <span className="mr-4 text-[#FFB23F]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="w-96 overflow-hidden rounded-full bg-gray-300">
                              <ProgressBar
                                variant="warning"
                                now={
                                  singleProduct.product.rating_breakdown
                                    .three_star.percentage
                                }
                              ></ProgressBar>
                            </div>
                            <span className="w-3">
                              {
                                singleProduct.product.rating_breakdown.three_star
                                  .count
                              }
                            </span>
                          </li>
                          <li className="flex items-center gap-4 text-sm font-medium">
                            <span className="w-3">2</span>
                            <span className="mr-4 text-[#FFB23F]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="w-96 overflow-hidden rounded-full bg-gray-300">
                              <ProgressBar
                                variant="warning"
                                now={
                                  singleProduct.product.rating_breakdown
                                    .two_star.percentage
                                }
                              ></ProgressBar>
                            </div>
                            <span className="w-3">
                              {
                                singleProduct.product.rating_breakdown.two_star
                                  .count
                              }
                            </span>
                          </li>
                          <li className="flex items-center gap-4 text-sm font-medium">
                            <span className="w-3">1</span>
                            <span className="mr-4 text-[#FFB23F]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="w-96 overflow-hidden rounded-full bg-gray-300">
                              <ProgressBar
                                variant="warning"
                                now={
                                  singleProduct.product.rating_breakdown
                                    .one_star.percentage
                                }
                              ></ProgressBar>
                            </div>
                            <span className="w-3">
                              {
                                singleProduct.product.rating_breakdown.one_star
                                  .count
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* /Reviews */}
                </div>
                {singleProduct.product.top_reviews.map((review) => {
                  let name = review.profile.name;
                  if (review.profile.name === "Placeholder") {
                    name = "Anonymous";
                  }
                  return (
                    <div className="">
                      <ul className="">
                        <li className="py-8 text-left border px-4 m-2">
                          <div className="flex items-start">
                            <FaCircleUser className="text-[3rem]" />
                            <div className="ml-6">
                              <Rating
                                readOnly
                                value={review.rating}
                                style={{ maxWidth: 100, color: "#FEF08A" }}
                              />
                              <h1>{review.title}</h1>
                              <p className="mt-5 text-base text-gray-900">
                                {review.body}
                              </p>
                              <p className="mt-5 text-sm font-bold text-gray-900">
                                {name}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">
                                {review.date.raw}
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <nav className="flex">
          <ol role="list" className="flex items-center">
            <li className="text-left">
              <div className="-m-1">
                <NavLink
                  to={"/"}
                  className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                >
                  {" "}
                  Home{" "}
                </NavLink>
              </div>
            </li>

            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <a
                    href="#"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                  >
                    {" "}
                    Products{" "}
                  </a>
                </div>
              </div>
            </li>

            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <a
                    href="#"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    aria-current="page"
                  >
                    {" "}
                    {param.asin}{" "}
                  </a>
                </div>
              </div>
            </li>
          </ol>
        </nav>

        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3 lg:row-end-1">
            <div className="lg:flex lg:items-start">
              <div className="lg:order-2 lg:ml-5">
                <div className="max-w-xl overflow-hidden rounded-lg">
                  <ShimmerThumbnail height={250} rounded />
                </div>
              </div>

              <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0 overflow-y-scroll h-[37.5rem]">
                <div className="flex flex-col items-start lg:flex-col">
                  <button
                    type="button"
                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                  >
                    <ShimmerThumbnail height={50} rounded />
                  </button>
                  <button
                    type="button"
                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                  >
                    <ShimmerThumbnail height={50} rounded />
                  </button>
                  <button
                    type="button"
                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                  >
                    <ShimmerThumbnail height={50} rounded />
                  </button>
                  <button
                    type="button"
                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                  >
                    <ShimmerThumbnail height={50} rounded />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <ShimmerSectionHeader className="sm: text-2xl font-bold text-gray-900 sm:text-3xl" />

            <div className="mt-5 flex items-center">
              <div className="flex items-center">
                <Rating
                  readOnly
                  value={5}
                  style={{ maxWidth: 100, color: "#FEF08A" }}
                />
              </div>
              <p className="ml-2 text-sm font-medium text-gray-500">
                1,209 Reviews
              </p>
            </div>

            <div className=" mb-2 flex  w-[180px] p-5 rounded-lg  bg-gray-100 justify-evenly items-center">
              <button
                className=" rounded-sm "
                disabled={cartItemCount === 1}
                onClick={() => {
                  dispatch(setCartItemCount(cartItemCount - 1));
                }}
              >
                <img src={minusSvg} alt="" />
              </button>
              <span className="">{cartItemCount}</span>

              <button
                className="rounded-sm bg-gray-100"
                onClick={() => {
                  dispatch(setCartItemCount(cartItemCount + 1));
                }}
              >
                <img src={plusSvg} alt="" />
              </button>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
              <div className="flex items-end">
                <ShimmerTable row={1} col={1} />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                onClick={() =>
                  // addToCart(dispatch, cartItems, param.asin, cartItemCount)
                  dispatch(
                    setCart({
                      type: "ADDEDTOCART",
                      payload: {
                        itemCount: cartItemCount,
                        itemId: param.asin,
                      },
                    }),
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 mr-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Add to cart
              </button>
            </div>

            <ul className="mt-8 space-y-2">
              <li className="flex items-center text-left text-sm font-medium text-gray-600">
                <svg
                  className="mr-2 block h-5 w-5 align-middle text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    className=""
                  ></path>
                </svg>
                Free shipping worldwide
              </li>

              <li className="flex items-center text-left text-sm font-medium text-gray-600">
                <svg
                  className="mr-2 block h-5 w-5 align-middle text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    className=""
                  ></path>
                </svg>
                Cancel Anytime
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="border-b border-gray-300">
              <nav className="flex gap-4">
                <a
                  href="#"
                  title=""
                  className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"
                >
                  {" "}
                  Description{" "}
                </a>

                <a
                  href="#"
                  title=""
                  className="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600"
                >
                  Reviews
                  <span className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100">
                    {" "}
                    1,209{" "}
                  </span>
                </a>
              </nav>
            </div>

            <div className="mt-8 flow-root sm:mt-12">
              <h1 className="text-3xl font-bold">Delivered To Your Door</h1>
              <p className="mt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                accusantium nesciunt fuga.
              </p>
              <h1 className="mt-8 text-3xl font-bold">
                From the Fine Farms of Brazil
              </h1>
              <p className="mt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                numquam enim facere.
              </p>
              <p className="mt-4">
                Amet consectetur adipisicing elit. Optio numquam enim facere.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
                rerum nostrum eius facere, ad neque.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProductPage;
