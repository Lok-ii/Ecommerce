import React, { memo } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItemCount } from "../../redux/cartSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CiHeart } from "react-icons/ci";

const ProductCard = memo(({ product }) => {
  const displayText =
    product.title.length > 25
      ? `${product.title.slice(0, 25)}...`
      : product.title;

  const dispatch = useDispatch();

  return (
    <div className="relative flex w-[20rem] flex-col group  overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <NavLink
        className="relative w-[100%] flex justify-center items-center h-60 overflow-hidden rounded-xl"
        to={"/product/" + product.asin}
      >
        <LazyLoadImage
          alt={displayText}
          src={product.image} // use normal <img> attributes as props
          className="object-contain group-hover:object-contain transition-all duration-300 w-[95%] h-[95%] rounded-xl"
          effect="opacity"
        />
      </NavLink>
      <div className="flex flex-col gap-4 py-4 px-2">
        <NavLink to={"/product/" + product.asin}>
          <h5 className="text-[1rem] font-medium tracking-tight text-slate-900 text-nowrap whitespace-nowrap">
            {displayText}
          </h5>
        </NavLink>
        <div className="flex flex-col justify-between">
          <p className="flex items-center gap-2 ">
            <span className="text-md font-bold text-slate-900">
              {product.price}
            </span>
            <span className="text-xs text-slate-900 line-through">
              {product.original_price}
            </span>
          </p>
          <div className="flex items-center">
            <Rating
              readOnly
              value={product.stars}
              style={{ maxWidth: 100, color: "#FEF08A" }}
            />
            <span className="mr-2 ml-3 rounded bg-[#FFB23F] px-2.5 py-0.5 text-xs font-semibold">
              {product.stars}
            </span>
          </div>
        </div>
        <NavLink
          to={"/product/" + product.asin}
          className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white bg-gray-700 transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg> */}
          View Product
        </NavLink>
      </div>
    </div>
    // <div className="product-list flex flex-wrap max-w-[15rem]">
    //   <div className="product-card w-full p-4 flex flex-col items-start gap-2 cursor-pointer transition duration-300 ease-in-out hover:shadow-xl">
    //     <CiHeart className="text-md font-bold self-end text-gray-400"></CiHeart>
    //     <div className="w-full h-40 overflow-hidden">
    //     <LazyLoadImage
    //       className="productImage w-full h-full object-contain"
    //       effect="opacity"
    //       src={product.image}
    //       alt=""
    //     />
    //     </div>
    //     <span className="productName text-base">{displayText}</span>
        
    //     <div className="rating flex items-center gap-2 cursor-default">
    //       <div className="ratingContainer bg-green-500 flex items-center gap-1 px-2 py-1 rounded text-white text-sm">
    //         <Rating
    //           readOnly
    //           value={product.stars}
    //           style={{ maxWidth: 100, color: "#FEF08A" }}
    //         />
    //         <span className="rating-value">{product.rating}</span>
    //       </div>
    //       <span className="ratingCount text-gray-600">{product.stars}</span>
    //     </div>
    //     <div className="price flex items-center gap-2 text-base">
    //       <span className="newPrice">{product.specialPrice}</span>
    //       <del className="oldPrice text-gray-600">{product.price}</del>
    //     </div>
    //   </div>
    // </div>
  );
});

export default ProductCard;
