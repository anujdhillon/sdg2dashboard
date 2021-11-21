import React, { useRef, useEffect, useState } from "react";
import {
  select,
  geoPath,
  geoMercator,
  scaleThreshold,
  event,
  scaleLinear,
  zoom,
} from "d3";
import useResizeObserver from "./useResizeObserver";
import data from "../Util/geo.json";
function GeoChart({
  target,
  subTarget,
  myData,
  activeArea,
  setActiveArea,
  demography,
  states,
  date,
  group,
  groups,
}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selected, setSelected] = useState(null);

  const getMax = () => {
    let maxVal = 0;
    for (let [key, val] of Object.entries(
      myData[date][groups[group]]["districtWise"]
    ))
      maxVal = Math.max(val, maxVal);
    return maxVal;
  };

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const container = select(wrapperRef.current);
    const tooltip = container
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
    const colorScale = scaleLinear().domain([0, 100]).range(["white", "red"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selected || data)
      .precision(1000);

    const zoomer = zoom()
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      })
      .scaleExtent([1, 40]);

    let mouseOver = function (d) {
      svg
        .selectAll(".country")
        .transition()
        .duration(200)
        .style("opacity", 0.5);
      select(this).transition().duration(200).style("opacity", 1);
      tooltip.style("opacity", 0.9);
      tooltip
        .html(() => {
          return (
            d.properties.name +
            ", " +
            d.properties.st_nm +
            " (" +
            getScore(d.properties.id) +
            ")"
          );
        })
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 150}px`);
    };

    let mouseLeave = function () {
      svg.selectAll(".country").transition().duration(200).style("opacity", 1);
      tooltip.style("opacity", 0);
    };

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    function getScore(id) {
      //return myData[date][groups[group]]["districtWise"][id];
      return 100 * Math.random();
    }

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("click", (feature) => {
        setSelected(selected === feature ? null : feature);
        tooltip.style("opacity", 0);
        if (activeArea === feature.properties.id) {
          setActiveArea(-1);
        } else {
          setActiveArea(feature.properties.id);
        }
      })
      .transition()
      .attr("class", "country")
      .attr("fill", (feature) => colorScale(getScore(feature.properties.id)))
      .attr("d", (feature) => pathGenerator(feature));

    // render text
  }, [
    dimensions,
    target,
    subTarget,
    activeArea,
    myData,
    demography,
    setActiveArea,
    group,
  ]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "50%" }}>
      <svg className="map-points" ref={svgRef}></svg>
      <div className="axis">
        {/* {colors.map((color, idx) => {
          return (
            <div className="legend-item" key={idx}>
              <button style={{ background: color }}></button>
              <span>&emsp;{names[idx]}</span>
            </div>
          );
        })} */}
      </div>
    </div>
  );
}
export default GeoChart;
