import React, { useState, useEffect, useCallback, memo } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { RiSearch2Line } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { LuShoppingCart } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import { CiDark } from "react-icons/ci";
import { GoSun } from "react-icons/go";
import { FaRegMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  setMode,
  setUserHeight,
  setSearchShow,
  setLoggedIn,
} from "../../redux/headerSlice";
import { setCurrentUser } from "../../redux/authSlice";
import { userAuthentication } from "../../redux/authSlice";
import { setCartItemCount, setCart, fetchAndSetCartData } from "../../redux/cartSlice";
import logo from "../../assets/Images/logo.png";

const Header = memo(() => {
  const navColor = ({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "text-red-500" : "";

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const location = useLocation();

  useEffect(() => {
    console.log("Current page path:", location.pathname);
    // You can use location.pathname as needed in your component logic
  }, [location]);

  const currentUser = useSelector((state) => state.authentication.currentUser);

  const { mode, userHeight, expandSearch, isLoggedIn } = useSelector(
    (store) => store.header,
  );

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("currentUser")) !== null && JSON.parse(localStorage.getItem("currentUser")) !== undefined &&
      Object.keys(JSON.parse(localStorage.getItem("currentUser"))).length !== 0
    ) {
      dispatch(setCurrentUser(JSON.parse(localStorage.getItem("currentUser"))));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(currentUser).length !== 0) {
      dispatch(setLoggedIn(true));
      if(location.pathname === "/"  || location.pathname === "/login" || location.pathname === "/signup"){
        navigateTo("/");
      }
    } else {
      dispatch(setLoggedIn(false));
    }
  }, [currentUser]);

  const toggleUserHeight = useCallback((e) => {
    if (!e.target.classList.contains("user") && !userHeight) {
      dispatch(setUserHeight(!userHeight));
    }
  }, [userHeight, dispatch]);

  useEffect(() => {
    window.addEventListener("click", toggleUserHeight);

    return () => {
      window.removeEventListener("click", toggleUserHeight);
    };
  }, [toggleUserHeight]);

  return (
    <header className="w-full h-20 flex justify-between items-center px-8 py-2 z-[10] bg-headerColor backdrop-filter backdrop-blur-lg sticky top-0">
      <Link to={"/"} className="logo">
        <img
          className="h-16 w-auto"
          src={logo}
          alt="Your Company"
        />
      </Link>
      <nav className="flex items-center justify-center gap-12 font-semibold text-[1.1rem]">
        <NavLink className={navColor} to="/">
          <span className="border-r-[1px] pr-8">Home</span>
        </NavLink>
        <NavLink className={navColor} to="/shop">
          <span className="border-r-[1px] pr-8">Shop</span>
        </NavLink>
        <NavLink className={navColor} to="/contact">
          <span className="">Contact</span>
        </NavLink>
      </nav>

      <IconContext.Provider
        value={{ className: "text-[1.5rem] font-bold cursor-pointer" }}
      >
        <div className="flex items-center gap-16">
          <form action="">
            <input
              type="text"
              placeholder="Search items..."
              className={`${
                expandSearch ? "w-[20rem] pl-4" : "w-[0px] p-0"
              } bg-gray-500 rounded-md py-1 transition-all duration-300 text-white`}
            />
          </form>
          <div className="flex items-center gap-4 ">
            <RiSearch2Line
              onClick={() => dispatch(setSearchShow(!expandSearch))}
            />
            <AiOutlineHeart />
            <NavLink to={"/cart"} onClick={ async () => {
              // const cartData = await fetchCartData();
              // console.log(cartData);
              // dispatch(setCart({ type: "GETDATA", payload: cartData }));
              dispatch(fetchAndSetCartData(dispatch));
              }}><LuShoppingCart /></NavLink>
            {isLoggedIn ? (
              <FaRegUserCircle
                className="user"
                onClick={() => dispatch(setUserHeight(!userHeight))}
              />
            ) : (
              <div className="flex gap-2">
                <NavLink to={"/login"}>
                  <button className="py-1 px-3 rounded-lg bg-gray-400 text-white font-medium">
                    LogIn
                  </button>
                </NavLink>
                <NavLink to={"/signup"}>
                  <button className="py-1 px-3 rounded-lg bg-gray-400 text-white font-medium">
                    SignUp
                  </button>
                </NavLink>
              </div>
            )}
          </div>
          <FaRegMoon
            className={`${mode ? "hidden" : ""}`}
            onClick={() => dispatch(setMode(!mode))}
          />
          <GoSun
            className={`${mode ? "" : "hidden"}`}
            onClick={() => dispatch(setMode(!mode))}
          />
        </div>
      </IconContext.Provider>
      <div
        className={`flex flex-col items-start rounded-lg text-white font-medium absolute right-28 w-[9rem] ${
          userHeight ? "top-[-15rem]" : "top-[5rem]"
        } transition-all duration-300`}
      >
        <p className="bg-gray-500 w-full rounded-t-lg py-2 pl-2 pr-8 hover:text-black cursor-pointer user hover:bg-white">
          Your Profile
        </p>
        <p className="bg-gray-500 w-full py-2 pl-2 pr-8 hover:text-black cursor-pointer user hover:bg-white">
          Your Orders
        </p>
        <p className="bg-gray-500 w-full py-2 pl-2 pr-8 hover:text-black cursor-pointer user hover:bg-white">
          Settings
        </p>
        <p
          className="bg-gray-500 w-full rounded-b-lg py-2 pl-2 pr-8 hover:text-black cursor-pointer user hover:bg-white"
          onClick={() => {
            dispatch(setUserHeight(true));
            dispatch(userAuthentication({ type: "SIGNOUT" }));
            dispatch(setCart({ type: "CLEARDATA", payload: [] }));
            dispatch(setCartItemCount(1));
            navigateTo("/");
            localStorage.removeItem("currentUser");
          }}
        >
          Sign Out
        </p>
      </div>
    </header>
  );
});

export default Header;
