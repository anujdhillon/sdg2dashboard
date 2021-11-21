import { React, useEffect, useState } from "react";
import httpClient from "../Util/httpClient";
import Dropdown from "../Components/Dropdown";
import { BASE_URL } from "../Util/base";
export default function NewRecord({ targets }) {
  const [data, setData] = useState(0);
  const [target, setTarget] = useState(0);
  const [subTarget, setSubTarget] = useState(0);
  const [status, setStatus] = useState(null);
  const addRecord = async () => {
    const resp = await httpClient.post(BASE_URL + "new", {
      sub_target_id: targets[target].subTargets[subTarget].id,
      value: data,
    });
    console.log(resp);
    setStatus(resp.data.message);
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1>Add today's statistics</h1>
        <form>
          <div>
            <label>Value: </label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="my-button text-box"
            />
          </div>
          {targets && (
            <Dropdown
              list={targets.map((item) => item.name)}
              label={"Select Categoy"}
              displayed={target}
              setDisplayed={setTarget}
            />
          )}
          {targets && (
            <Dropdown
              list={targets[target].subTargets.map((item) => item.name)}
              label={"Select Category II"}
              displayed={subTarget}
              setDisplayed={setSubTarget}
            />
          )}
          <div className="submit-button-container">
            <button type="button" className="nav-button" onClick={addRecord}>
              Add
            </button>
          </div>
          {status && <span>{status}</span>}
        </form>
      </div>
    </div>
  );
}
