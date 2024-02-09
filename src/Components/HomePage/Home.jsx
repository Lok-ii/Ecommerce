import React, { lazy, memo, useEffect, Suspense } from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/custom-animations/open-animation.css";
import bg1 from "../../assets/Images/bg1.jpg";
import bg2 from "../../assets/Images/bg2.jpg";
import bg3 from "../../assets/Images/bg3.jpg";
import bg4 from "../../assets/Images/bg4.jpg";
import bg5 from "../../assets/Images/bg5.jpg";
import Countdown from "react-countdown";
import Accessories from "../../assets/ProductData/Accessories.json";
import Clothes from "../../assets/ProductData/Clothes.json";
import Groceries from "../../assets/ProductData/Groceries.json";
import HomeAppliances from "../../assets/ProductData/HomeAppliances.json";
import HomeDecor from "../../assets/ProductData/HomeDecor.json";
import Laptop from "../../assets/ProductData/Laptop.json";
import Phone from "../../assets/ProductData/Phone.json";
import Shoes from "../../assets/ProductData/Shoes.json";
import Watch from "../../assets/ProductData/Watch.json";
import "./slick.css";
import "./slick-theme.css";
import Slider from "react-slick";
// import ProductCard from "../Product/ProductCard";
import { ShimmerPostItem } from "react-shimmer-effects";
import Carousel from "nuka-carousel";
import { easeCircleOut, easeElasticOut } from 'd3-ease';
// import { fetchLocalData } from "../../utils/localApi";

const ProductCard = lazy(() => import("../Product/ProductCard"));

const Home = memo(() => {
  const AutoPlaySlider = withAutoplay(AwesomeSlider);
  const Completionist = () => <Countdown date={Date.now() + 259200000} />;

  //  useEffect(() => {
  //   fetchLocalData();
  //  }, [])

  const productsList = [
    Accessories,
    Clothes,
    Groceries,
    HomeAppliances,
    HomeDecor,
    Laptop,
    Phone,
    Shoes,
    Watch,
  ];

  const setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="hero w-full min-h-[100vh] z-[-1]">
        <AutoPlaySlider
          play={true}
          cancelOnInteraction={false} // should stop playing on user interaction
          interval={2000}
          animation="openAnimation"
          bullets={false}
          organicArrows={true}
          fillParent={true}
          infinite={true}
          mobileTouch={true}
          className={`w-full h-full`}
        >
          <div data-src={bg1} className="w-full">
            <div>
              <p>product</p>
            </div>
          </div>
          <div data-src={bg2} className="w-full" />
          <div data-src={bg3} className="w-full" />
          <div data-src={bg4} className="w-full" />
          <div data-src={bg5} className="w-full" />
        </AutoPlaySlider>
      </div>

      <div className="w-full flex flex-col gap-8">
        <div className="flashSale">
          <div>
            <p>Today's</p>
          </div>
          <div>
            <p>Flash Sale</p>
            <Countdown date={Date.now() + 259200000}>
              <Completionist />
            </Countdown>
          </div>
          <div className="flashSaleItems"></div>
        </div>

        {productsList.map((category, id) => {
          return (
            <div className="w-full flex flex-col gap-4 px-8" key={id}>
              <div className="w-full">
                <p className="text-[2rem]">{category[0].name}</p>
              </div>
              <div>
                <Carousel
                  tabbed={false}
                  slidesToScroll={1}
                  slidesToShow={6}
                  wrapAround={true}
                  autoplay={true}
                  animation="zoom"
                  autoplayInterval={3000}
                >
                  {category.map((items, idx) => {
                    return (
                      <div key={`${id}-${idx}`}>
                        {idx > 0 && (
                          <ProductCard product={items} key={items.asin} />
                          // <Suspense
                          //   fallback={<ShimmerPostItem card title text cta />}
                          // >
                          //   <ProductCard product={items} key={items.asin} />
                          // </Suspense>
                        )}
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Home;
