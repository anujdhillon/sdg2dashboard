import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useHistory } from "react-router";
export default function Card({ info, setTarget, target }) {
  let history = useHistory();
  return (
    <div className="target-card">
      <h1>{info.label}</h1>
      <h3>{info.statement}</h3>
      <div className="forward-link" key={target}>
        <button
          className="info-link"
          onClick={() => {
            setTarget(target);
            history.push("/infographics");
          }}
        >
          <FontAwesomeIcon size="2x" icon={faArrowRight} className="arrow" />
        </button>
      </div>
    </div>
  );
}
