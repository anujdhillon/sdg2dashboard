import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import httpClient from "../Util/httpClient";
export default function Table({ activeArea }) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "phone", headerName: "Phone Number", width: 600 },
  ];
  const fetchAreaDetails = async (id) => {
    try {
      if (id == -1) id = 0;
      const resp = await httpClient.get("//127.0.0.1:5000/users/" + id);
      console.log(resp);
      setRows(resp.data);
    } catch (e) {
      console.log(e);
    }
  };

  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetchAreaDetails(activeArea);
  }, [activeArea]);
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
