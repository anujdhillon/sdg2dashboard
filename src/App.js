import { React, useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Infographics from "./Pages/Infographics";
import "./App.scss";
import axios from "axios";

const DEBUG = false;
const url = DEBUG
  ? "http://10.0.2.15:5000/readData"
  : "https://sdg2dashboard.herokuapp.com/readData";

export default function App() {
  const [demography, setDemography] = useState("state");
  const [indicator, setIndicator] = useState(0);
  const [target, setTarget] = useState(0);
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      let resp = await axios.get(url);
      setData((data) => resp.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (data === null) {
      fetchData();
    }
  }, [data]);
  if (data === null)
    return (
      <div>Fetching... (PS: This site is not built for mobile devices yet)</div>
    );
  else {
    // console.log(data);
    return (
      <div className="App">
        <div className="header">
          <div className="container">
            <img src="/assets/dpdeslogo.png" alt="DPDES Logo"></img>
            <img src="/assets/sdg2logo.png" alt="SDG2 Logo"></img>
          </div>
        </div>
        <div className="body">
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Home
                  allTargets={data.targets}
                  setTarget={setTarget}
                  demography={demography}
                  setDemography={setDemography}
                />
              )}
            />
            <Route
              path="/infographics"
              render={(props) => (
                <Infographics
                  demography={demography}
                  setDemography={setDemography}
                  target={target}
                  setTarget={setTarget}
                  indicator={indicator}
                  setIndicator={setIndicator}
                  data={data}
                  setData={setData}
                  fetchData={fetchData}
                />
              )}
            />
          </Switch>
        </div>
        <div className="footer">
          <div className="container">
            <div>
              <h1>Quick Links</h1>
              <ul>
                <li>Niti Aayog</li>
                <li>MoSPI, GoI</li>
                <li>Department of Planning, GoR</li>
              </ul>
            </div>
            <div style={{ textAlign: "center" }}>
              <img src="assets/wfplogo.png" alt="WFP Logo"></img>
            </div>
            <div>
              <h1>Developed in collaboration with:</h1>
              <p>
                Public systems Lab, Indian Institute of Technology, Delhi <br />
                Contact: 011-26596317
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
