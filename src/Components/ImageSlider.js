import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { React, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function ImageSlider() {
  let slides = [
    {
      heading: "This is heading",
      content: "This is content",
      image: "../assets/waterfall.jpg",
    },
    {
      heading: "This is heading",
      content: "This is content",
      image: "../assets/waterfall.jpg",
    },
    {
      heading: "This is heading",
      content: "This is content",
      image: "../assets/waterfall.jpg",
    },
    {
      heading: "This is heading",
      content: "This is content",
      image: "../assets/waterfall.jpg",
    },
    {
      heading: "This is heading",
      content: "This is content",
      image: "../assets/waterfall.jpg",
    },
  ];
  let colors = [
    "#c8e4b4",
    "#99ffcc",
    "#ffcccc",
    "#ffe4cc",
    "#e8e4e4",
    "#d0e4fc",
    "#fffccc",
    "#e8ccfc",
  ];
  const [displayed, setDisplayed] = useState(0);
  const [textOnLeft, setTextOnLeft] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed((displayed) => (displayed + 1) % slides.length);
      setTextOnLeft((textOnLeft) => !textOnLeft);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);
  let textArea = (
    <div
      style={{
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      }}
      className="slider-text"
    >
      <div className="text-container">
        <h1>{slides[displayed].heading}</h1>
        <p>{slides[displayed].content}</p>
      </div>
    </div>
  );
  let imageArea = (
    <div className="slider-image">
      <img
        src={slides[displayed].image}
        height="500px"
        alt={slides[displayed].heading}
      ></img>
    </div>
  );
  return (
    <div className="image-slider">
      <TransitionGroup>
        <CSSTransition key={displayed} timeout={1000} classNames="messageout">
          <div className="content">
            {textOnLeft ? textArea : imageArea}
            {textOnLeft ? imageArea : textArea}
          </div>
        </CSSTransition>
      </TransitionGroup>

      <button
        onClick={() => {
          setDisplayed((displayed - 1 + slides.length) % slides.length);

          setTextOnLeft(!textOnLeft);
        }}
        className="button-left"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={() => {
          setDisplayed((displayed + 1) % slides.length);
          setTextOnLeft(!textOnLeft);
        }}
        className="button-right"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <div className="dots">
        {slides.map((item, idx) => (
          <button
            onClick={() => {
              setDisplayed((displayed) => idx);
            }}
            style={{
              backgroundColor: `${displayed === idx ? "grey" : "white"}`,
              border: "2px solid black",
              width: "10px",
              height: "10px",
              margin: "1px",
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
