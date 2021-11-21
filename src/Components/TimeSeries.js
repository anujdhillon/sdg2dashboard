import { getGridDateOperators } from "@mui/x-data-grid";
import { active } from "d3-transition";
import { React, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
export default function TimeSeries({
  group,
  groups,
  activeArea,
  date,
  setDate,
  data,
  subTarget,
  allTargets,
  target,
}) {
  const [series, setSeries] = useState([]);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (dates === []) {
      let newdates = [];
      for (const [key, value] of Object.entries(data)) {
        dates.push(key);
      }
      setDates(newdates);
    }
  }, [dates]);

  useEffect(() => {
    let groupWise = {};
    for (const [date, values] of Object.entries(data)) {
      for (const [groupId, vals] of Object.entries(values)) {
        if (vals.name in groupWise) {
          groupWise[vals.name].push({
            x: date,
            y: activeArea === -1 ? vals.overall : vals.districtWise[activeArea],
          });
        } else {
          let yy =
            activeArea === -1 ? vals.overall : vals.districtWise[activeArea];
          console.log(yy);
          groupWise[vals.name] = [
            {
              x: date,
              y: yy,
            },
          ];
        }
      }
    }
    let newSeries = [];
    for (const [name, vals] of Object.entries(groupWise)) {
      newSeries.push({
        name: name,
        data: vals,
      });
    }
    setSeries(newSeries);
    console.log(newSeries);
  }, [data, group, subTarget, groups, data, activeArea]);

  const [options, setOptions] = useState({
    chart: {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Daily change",
      align: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      title: {
        text: allTargets[target].subTargets[subTarget].name,
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  });
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
}
