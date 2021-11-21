import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { React, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useHistory } from "react-router-dom";
export default function ImageSlider({ allTargets, setTarget, colors }) {
  let history = useHistory();
  const [displayed, setDisplayed] = useState(0);
  const [textOnLeft, setTextOnLeft] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed((displayed) => (displayed + 1) % allTargets.length);
      setTextOnLeft((textOnLeft) => !textOnLeft);
    }, 12000);
    return () => clearInterval(interval);
  }, [allTargets.length]);
  let textArea = (
    <div
      style={{
        backgroundColor: colors[displayed % colors.length].bg,
        color: colors[displayed % colors.length].fg,
      }}
      className="slider-text"
      onClick={() => {
        setTarget(displayed);
        history.push("/infographics");
      }}
    >
      <div className="text-container">
        <h1>{allTargets[displayed].name}</h1>
        <span>{allTargets[displayed].fullDescription}</span>
      </div>
    </div>
  );
  let imageArea = (
    <div className="slider-image">
      <img src={allTargets[displayed].img} height="500px" alt="SDG2"></img>
    </div>
  );
  return (
    <div className="image-slider">
      <TransitionGroup>
        <CSSTransition key={displayed} timeout={200} classNames="messageout">
          <div className="content">
            {textOnLeft ? textArea : imageArea}
            {textOnLeft ? imageArea : textArea}
          </div>
        </CSSTransition>
      </TransitionGroup>

      <button
        onClick={() => {
          setDisplayed((displayed - 1 + allTargets.length) % allTargets.length);

          setTextOnLeft(!textOnLeft);
        }}
        className="button-left"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={() => {
          setDisplayed((displayed + 1) % allTargets.length);
          setTextOnLeft(!textOnLeft);
        }}
        className="button-right"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <div style={{ background: "none" }} className="dots">
        {allTargets.map((item, idx) => (
          <div
            onClick={() => {
              setDisplayed((displayed) => idx);
            }}
            style={{
              backgroundColor: `${displayed === idx ? "grey" : "white"}`,
              width: "10px",
              height: "10px",
              margin: "1px",
              borderRadius: "5px",
            }}
            key={idx}
          ></div>
        ))}
      </div>
    </div>
  );
}
