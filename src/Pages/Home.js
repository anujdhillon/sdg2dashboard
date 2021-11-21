import React from "react";
import { useHistory } from "react-router-dom";
import Card from "../Components/Card";
import ImageSlider from "../Components/ImageSlider";
import Navbar from "../Components/Navbar";
export default function Home({
  allTargets,
  setTarget,
  demography,
  setDemography,
  user,
  colors,
}) {
  let history = useHistory();
  return (
    <div className="home">
      <div className="image-slider-area">
        <ImageSlider
          allTargets={allTargets}
          setTarget={setTarget}
          colors={colors}
        />
      </div>
      <div className="all-targets">
        <div className="all-targets-container">
          {allTargets.map((item, idx) => (
            <Card
              info={item}
              setTarget={setTarget}
              target={idx}
              key={idx}
              colors={colors}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
