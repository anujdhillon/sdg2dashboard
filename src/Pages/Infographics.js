import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Dropdown from "../Components/Dropdown";

export default function Infographics({
  demography,
  setDemography,
  target,
  setTarget,
  indicator,
  setIndicator,
  allTargets,
}) {
  return (
    <div className="infographics">
      <div className="options">
        <div className="home-button">
          <a href="/">
            <button>
              <FontAwesomeIcon icon={faHome} />
            </button>
          </a>
        </div>
        <div className="left">
          <div className="container">
            <button
              className={`dem-button ${!demography ? "button-active" : ""}`}
              onClick={() => {
                setDemography(!demography);
              }}
            >
              State
            </button>
            <button
              className={`dem-button ${demography ? "button-active" : ""}`}
              onClick={() => {
                setDemography(!demography);
              }}
            >
              District
            </button>
          </div>
        </div>
        <div className="middle">
          <Dropdown
            list={allTargets}
            label={"Select Target"}
            displayed={target}
            setDisplayed={setTarget}
          />
        </div>
        <div className="right">
          <Dropdown
            list={allTargets[target].indicators}
            label={"Select Indicator"}
            displayed={indicator}
            setDisplayed={setIndicator}
          />
        </div>
      </div>
      <div className="middle-body"></div>
    </div>
  );
}
