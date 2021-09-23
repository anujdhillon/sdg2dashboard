import React from "react";
import { useHistory } from "react-router-dom";
import Card from "../Components/Card";
import ImageSlider from "../Components/ImageSlider";
export default function Home({
  allTargets,
  setTarget,
  demography,
  setDemography,
}) {
  let history = useHistory();
  return (
    <div className="home">
      <div className="navbar">
        <button>Home</button>
        <button
          onClick={() => {
            setDemography(false);
            history.push("/infographics");
          }}
        >
          State Indicators
        </button>
        <button
          onClick={() => {
            setDemography(true);
            history.push("/infographics");
          }}
        >
          District Indicators
        </button>
        <button>FANSA</button>
      </div>
      <div className="image-slider-area">
        <ImageSlider />
      </div>
      <div className="all-targets">
        <div className="all-targets-container">
          {allTargets.map((item, idx) => (
            <Card info={item} setTarget={setTarget} target={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
