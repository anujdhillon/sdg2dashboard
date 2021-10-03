import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { React, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table";
import GeoChart from "../Components/GeoChart";
export default function Infographics({
  demography,
  setDemography,
  target,
  setTarget,
  indicator,
  setIndicator,
  data,
  setData,
  fetchData,
}) {
  const [activeArea, setActiveArea] = useState(-1);
  const [options] = useState({
    annotations: {
      points: [
        {
          x: "Rajasthan",
          label: {
            borderColor: "#775DD0",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "Average State Value",
          },
        },
      ],
    },
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (config.selectedDataPoints[0].length) {
            let district =
              chartContext.data.twoDSeriesX[config.selectedDataPoints[0][0]];
            // console.log(district);
            setActiveArea(data[demography + "_indices"][district]);
          } else {
            setActiveArea(-1);
          }
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "100%",
      },
    },
    stroke: {
      width: 2,
    },

    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: "Score",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
  });
  function getSeries(list) {
    // console.log(list);
    var vals = list.map((item) => {
      return {
        x: data[demography + "_names"][item[1]],
        y: item[0],
      };
    });
    vals.push({
      x: "Rajasthan",
      y: data.infocus[data.targets[target].indicators[indicator].number],
    });
    vals = vals.sort(function (a, b) {
      if (a.y < b.y) return 1;
      else if (a.y > b.y) return -1;
      return 0;
    });
    // console.log(vals);
    return [
      {
        name: "Score",
        data: vals,
      },
    ];
  }
  useEffect(() => {
    if (data === null) {
      fetchData();
    }
  }, [data, fetchData]);
  if (data === null) return <div>Fetching...</div>;
  else
    return (
      <div className="infographics">
        <div className="options-area">
          <div className="home-button">
            <a href="/">
              <button>
                <FontAwesomeIcon icon={faHome} size="2x" />
              </button>
            </a>
          </div>
          <div className="left">
            <div className="container">
              <button
                className={`dem-button ${
                  demography === "state" ? "button-active" : ""
                }`}
                style={{ borderRadius: "10px 0 0 10px" }}
                onClick={() => {
                  setDemography("state");
                }}
              >
                State
              </button>
              <button
                className={`dem-button ${
                  demography === "district" ? "button-active" : ""
                }`}
                style={{ borderRadius: "0 10px 10px 0" }}
                onClick={() => {
                  setDemography("district");
                }}
              >
                District
              </button>
            </div>
          </div>
          <div className="middle">
            <Dropdown
              list={data.targets}
              label={"Select Target"}
              displayed={target}
              setDisplayed={setTarget}
            />
          </div>
          <div className="right">
            <Dropdown
              list={data.targets[target].indicators}
              label={"Select Indicator"}
              displayed={indicator}
              setDisplayed={setIndicator}
            />
          </div>
        </div>
        <div className="map-area">
          <GeoChart
            indicator={indicator}
            target={target}
            myData={data}
            activeArea={activeArea}
            setActiveArea={setActiveArea}
            demography={demography}
          />
          {activeArea !== -1 && (
            <Table
              activeArea={activeArea}
              data={data}
              demography={demography}
            />
          )}
        </div>
        <div className="all-districts-chart">
          <ReactApexChart
            type="bar"
            height="400px"
            options={options}
            series={getSeries(
              data.targets[target].indicators[indicator].values[demography]
            )}
          />
        </div>
      </div>
    );
}
