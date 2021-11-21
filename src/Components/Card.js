import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useHistory } from "react-router";
export default function Card({ info, setTarget, target, colors }) {
  let history = useHistory();
  return (
    <div
      className="target-card"
      style={{
        color: colors[target % colors.length].fg,
        backgroundColor: colors[target % colors.length].bg,
      }}
    >
      <h1>{info.name}</h1>
      <p style={{ fontSize: "20px", fontWeight: "500" }}>
        {info.shortDescription}
      </p>
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
