import React, { useRef, useEffect } from "react";
import { select, geoPath, geoMercator, scaleThreshold, event } from "d3";
import useResizeObserver from "./useResizeObserver";
import colors from "./colors";
function GeoChart({
  target,
  indicator,
  myData,
  activeArea,
  setActiveArea,
  demography,
}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const names = [
    "No Data",
    "<20%",
    "20-39.9%",
    "40-59.9%",
    "60-79.9%",
    ">=80%",
  ];

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const container = select(wrapperRef.current);
    const tooltip = container
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
    const colorScale = scaleThreshold()
      .domain([1, 20, 40, 60, 80, 100])
      .range(colors);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], myData[demography + "_map"])
      .precision(100);

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
            d.properties.DIST_NAME + ", " + getScore(d.properties.DIST_NAME)
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

    function getScore(district) {
      // console.log(district);
      let ind = myData[demography + "_indices"][district];
      // console.log(ind, district);
      let filteredData = myData.targets[target].indicators[indicator].values[
        demography
      ].filter((item) => {
        return item[1] === ind;
      });
      return filteredData[0][0];
    }

    // render each country
    svg
      .selectAll(".country")
      .data(myData[demography + "_map"].features)
      .join("path")
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("click", (feature) => {
        tooltip.style("opacity", 0);
        if (
          activeArea ===
          myData[demography + "_indices"][feature.properties.DIST_NAME]
        ) {
          setActiveArea(-1);
        } else {
          setActiveArea(
            myData[demography + "_indices"][feature.properties.DIST_NAME]
          );
        }
      })
      .transition()
      .attr("class", "country")
      .attr("fill", (feature) =>
        colorScale(getScore(feature.properties["DIST_NAME"]))
      )
      .attr("d", (feature) => pathGenerator(feature));

    // render text
  }, [
    dimensions,
    target,
    indicator,
    activeArea,
    myData,
    demography,
    setActiveArea,
  ]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "50%" }}>
      <svg className="map-points" ref={svgRef}></svg>
      <div className="axis">
        {colors.map((color, idx) => {
          return (
            <div className="legend-item" key={idx}>
              <button style={{ background: color }}></button>
              <span>&emsp;{names[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GeoChart;
