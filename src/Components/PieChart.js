import { React, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export default function PieChart({ data, date, activeArea }) {
  const [series, setSeries] = useState(null);

  const getLabels = () => {
    let newlabels = [];
    for (const [key, value] of Object.entries(data[date])) {
      newlabels.push(value.name);
    }
    return newlabels;
  };

  useEffect(() => {
    let newseries = [];
    for (const [key, value] of Object.entries(data[date])) {
      if (activeArea === -1) newseries.push(value.overall);
      else {
        if (value.districtWise[activeArea] > 0)
          newseries.push(value.districtWise[activeArea]);
        else continue;
      }
    }
    setSeries(newseries);
  }, [data, date, activeArea, setSeries]);

  const [options, setOptions] = useState({
    chart: {
      width: 380,
      type: "pie",
    },
    title: {
      text: "Paracetamol stock",
      align: "left",
    },
    labels: getLabels(),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  if (series === null) return <div>Fetching</div>;
  else
    return (
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={350}
      />
    );
}
