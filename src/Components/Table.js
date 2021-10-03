import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
// import { height } from "@mui/system";
// import { act } from "react-dom/test-utils";
// import { CSSTransition, TransitionGroup } from "react-transition-group";
// import { active } from "d3-transition";
export default function Table({ activeArea, data, demography }) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "target", headerName: "Target", width: 120 },
    { field: "indicator", headerName: "Indicator", width: 600 },
    {
      field: "infocus",
      headerName: data[demography + "_names"][activeArea],
      width: 150,
    },
    {
      field: "reference",
      headerName: "Rajasthan",
      width: 150,
    },
  ];

  const [rows, setRows] = useState([]);
  useEffect(() => {
    let newRows = [];
    let cnt = 1;
    data.targets.forEach((targ) => {
      targ.indicators.forEach((indi) => {
        indi.values[demography].forEach((pair) => {
          if (pair[1] === activeArea) {
            newRows.push({
              id: cnt,
              target: targ.number,
              indicator: indi.number,
              infocus: pair[0],
              reference: data.infocus[indi.number],
            });
            cnt++;
          }
        });
      });
    });
    setRows(newRows);
  }, [activeArea, data, demography]);
  if (activeArea === -1)
    return <div className="table-container">Select an Area</div>;
  else {
    return (
      <div className="table-container">
        <DataGrid
          rows={rows}
          loading={rows.length === 0}
          columns={columns}
          pageSize={20}
          rowHeight={30}
          rowsPerPageOptions={[20]}
        />
      </div>
    );
  }
}
