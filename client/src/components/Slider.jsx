import React, { useEffect, useState } from "react";
import s1 from "../assets/images/s1.jpg";
import s2 from "../assets/images/s2.jpg";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { nextSlide, prevSlide } from "../features/sliderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Slider = () => {
  const navigate = useNavigate();
  const [showbtns, setShowbtns] = useState(false);
  let slideIndex = useSelector((state) => state.slider.value);
  const dispatch = useDispatch();
  const slides = [
    {
      id: 1,
      image: s1,
      header: "Phones and accessories",
      text: "Get 50% discount on any product on your first purchase",
    },
    {
      id: 0,
      image: s2,
      header: "Laptops & Tablets",
      text: "Get all phones and headphones at a discount",
    },
  ];
  useEffect(() => {
    let int = setInterval(() => {
      dispatch(nextSlide(slideIndex++));
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <>
      {slides.map((slide, i) => {
        return (
          slideIndex === slide.id && (
            <div
              onMouseEnter={() => setShowbtns(true)}
              onMouseLeave={() => setShowbtns(false)}
              key={i}
              className="sm:pt-20 pt-14 sm:px-14   flex items-center justify-center"
            >
              <div className="w-1/3 p-2 pl-5 sm:h-80 h-40 bg-cyan-500 flex flex-col items-center justify-around">
                <div className="flex flex-col  text-black">
                  <h1 className="sm:text-3xl text-white sm:font-extrabold">
                    {slide.header}
                  </h1>
                  <p className="font-light text-xs sm:text-2xl">{slide.text}</p>
                </div>
                <button
                  onClick={(e) => {
                    navigate("/product", {
                      state: { id: "654f661e68197faf921b603f" },
                    });
                  }}
                  className="border-2 hover:border-black hover:bg-black border-black w-2/3 text-black hover:text-white sm:font-bold py-1 text-xs sm:text-base"
                >
                  shop now
                </button>
              </div>
              <img src={slide.image} className="sm:h-80 h-40 w-2/3" />
              {showbtns && (
                <div className="absolute w-full  flex  sm:justify-between justify-end s items-center sm:px-16 px-2">
                  <button
                    onClick={() => dispatch(prevSlide(slideIndex - 1))}
                    className="h-7 w-7  hover:bg-gray-400  sm:flex hidden items-center justify-center shadow-sm shadow-black rounded-full bg-gray-300"
                  >
                    <BsChevronLeft />
                  </button>
                  <button
                    onClick={() => dispatch(nextSlide(slideIndex + 1))}
                    id="next"
                    className="h-7 w-7  hover:bg-gray-400 flex  items-center justify-center shadow-sm shadow-black rounded-full bg-gray-300"
                  >
                    <BsChevronRight />
                  </button>
                </div>
              )}
            </div>
          )
        );
      })}
    </>
  );
};

export default Slider;
