import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { React, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Dropdown from "../Components/Dropdown";
import Table from "../Components/Table";
import GeoChart from "../Components/GeoChart";
import TimeSeries from "../Components/TimeSeries";
import PieChart from "../Components/PieChart";
import httpClient from "../Util/httpClient";
import { flexbox } from "@mui/system";
export default function Infographics({
  demography,
  setDemography,
  target,
  setTarget,
  subTarget,
  setSubTarget,
  allTargets,
  states,
}) {
  let today = new Date().toISOString().substr(0, 10);
  let history = useHistory();
  const [activeArea, setActiveArea] = useState(-1);
  const [data, setData] = useState(null);
  const [date, setDate] = useState(today);
  const [group, setGroup] = useState(0);
  const [groups, setGroups] = useState(null);
  const [area, setArea] = useState(null);

  const fetchAreaDetails = async (id) => {
    try {
      const resp = await httpClient.get("//127.0.0.1:5000/district/" + id);
      setArea(resp.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async (id) => {
    try {
      const resp = await httpClient.get("//127.0.0.1:5000/records/" + id);
      //console.log(resp.data);
      setData(resp.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (activeArea === -1) setArea(null);
    else {
      fetchAreaDetails(activeArea);
    }
  }, [activeArea, setArea]);

  useEffect(() => {
    fetchData(allTargets[target].subTargets[subTarget].id);
  }, [subTarget, target, allTargets]);

  useEffect(() => {
    if (data !== null && groups === null) {
      let newGroups = [];
      for (const [key, value] of Object.entries(data[date])) {
        newGroups.push(key);
      }
      setGroups((groups) => newGroups);
    }
  }, [data, groups, group, date]);

  if (data === null || groups === null) return <div>Fetching...</div>;
  else
    return (
      <div className="infographics">
        <div className="options-area">
          <div className="left">
            <Dropdown
              list={groups.map((item) => data[date][item].name)}
              label={"Select Group"}
              displayed={group}
              setDisplayed={setGroup}
            />
          </div>
          <div className="middle">
            <Dropdown
              list={allTargets.map((item) => item.name)}
              label={"Select Statistics"}
              displayed={target}
              setDisplayed={setTarget}
            />
          </div>
          <div className="right">
            <Dropdown
              list={allTargets[target].subTargets.map((item) => item.name)}
              label={"Select Sub Category"}
              displayed={subTarget}
              setDisplayed={setSubTarget}
            />
          </div>
        </div>
        <div className="map-area">
          <GeoChart
            subTarget={subTarget}
            target={target}
            myData={data}
            activeArea={activeArea}
            setActiveArea={setActiveArea}
            demography={demography}
            states={states}
            date={date}
            group={group}
            groups={groups}
          />
          <div className="details-area">
            <div className="main-details">
              <div className="left">
                <h1>
                  {area === null ? "India" : area.name + ", " + area.state}
                </h1>
              </div>
              <div className="right">
                <p>
                  Population:&emsp;
                  {area === null
                    ? "1.3B"
                    : area.population === null
                    ? "Unknown"
                    : area.population}
                </p>
                <p>
                  Sex Ratio:&emsp;
                  {area === null
                    ? "948"
                    : area.sexRatio === null
                    ? "Unknown"
                    : area.sexRatio}
                </p>
              </div>
            </div>
            {<Table activeArea={activeArea} />}
          </div>
        </div>
        <div className="all-districts-chart">
          {/* <ReactApexChart
          type="bar"
          height="400px"
          options={options}
          series={getSeries()}
        /> */}
        </div>
        <div className="bottom">
          <div className="time-series-chart">
            <TimeSeries
              group={group}
              groups={groups}
              activeArea={activeArea}
              date={date}
              setDate={setDate}
              data={data}
              subTarget={subTarget}
              allTargets={allTargets}
              target={target}
            />
          </div>
          <div
            className="pie-chart"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <PieChart data={data} date={date} activeArea={activeArea} />
          </div>
        </div>
      </div>
    );
}

//const [options] = useState({
//   // annotations: {
//   //   points: [
//   //     {
//   //       x: "Rajasthan",
//   //       label: {
//   //         borderColor: "#775DD0",
//   //         offsetY: 0,
//   //         style: {
//   //           color: "#fff",
//   //           background: "#775DD0",
//   //         },
//   //         text: "Average State Value",
//   //       },
//   //     },
//   //   ],
//   // },
//   chart: {
//     events: {
//       dataPointSelection: (event, chartContext, config) => {
//         if (config.selectedDataPoints[0].length) {
//           let district =
//             chartContext.data.twoDSeriesX[config.selectedDataPoints[0][0]];
//           // console.log(district);
//           setActiveArea(data[demography + "_indices"][district]);
//         } else {
//           setActiveArea(-1);
//         }
//       },
//     },
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 10,
//       columnWidth: "100%",
//     },
//   },
//   stroke: {
//     width: 2,
//   },

//   grid: {
//     row: {
//       colors: ["#fff", "#f2f2f2"],
//     },
//   },
//   xaxis: {
//     labels: {
//       rotate: -45,
//     },
//   },
//   yaxis: {
//     title: {
//       text: "Score",
//     },
//   },
//   fill: {
//     type: "gradient",
//     gradient: {
//       shade: "light",
//       type: "horizontal",
//       shadeIntensity: 0.25,
//       gradientToColors: undefined,
//       inverseColors: true,
//       opacityFrom: 0.85,
//       opacityTo: 0.85,
//       stops: [50, 0, 100],
//     },
//   },
// });
// function getSeries() {
//   console.log(allTargets[target]);
//   var vals = [];
//   for (let i = 0; i < 10; i++) {
//     vals.push({ x: i, y: 100 * Math.random() });
//   }
//   return [
//     {
//       name: "Score",
//       data: vals,
//     },
//   ];
// }
