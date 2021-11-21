import { React, useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Infographics from "./Pages/Infographics";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import LoadingScreen from "react-loading-screen";
import colors from "./Components/colors";
import "./App.scss";
import httpClient from "./Util/httpClient";
import NewRecord from "./Pages/NewRecord";
import { BASE_URL } from "./Util/base";

export default function App() {
  const [demography, setDemography] = useState("state");
  const [subTarget, setSubTarget] = useState(0);
  const [target, setTarget] = useState(3);
  const [allTargets, setAllTargets] = useState(null);
  const [user, setUser] = useState(null);
  const [states, setStates] = useState(null);

  const fetchStates = async () => {
    const resp = await httpClient.get(BASE_URL + "states");
    console.log(resp);
    setStates(resp.data);
  };

  const fetchTargets = async () => {
    try {
      let resp = await httpClient.get(BASE_URL + "/targets");
      console.log(resp);
      setAllTargets(resp.data);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchUser = async () => {
    try {
      let resp = await httpClient.get(BASE_URL + "@me");
      setUser(resp.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (states === null) fetchStates();
  }, [states]);

  useEffect(() => {
    if (allTargets === null) fetchTargets();
  }, [allTargets]);

  useEffect(() => {
    fetchUser();
  }, []);

  // console.log(data);
  if (allTargets === null) return <div>Fetching...</div>;
  else
    return (
      <div className="App">
        <div className="header">
          <Navbar user={user} />
        </div>
        <div className="body">
          <Switch>
            <Route exact path="/login" render={(props) => <Login />} />
            <Route
              exact
              path="/new"
              render={(props) => <NewRecord targets={allTargets} user={user} />}
            />
            <Route
              exact
              path="/register"
              render={(props) => <Register states={states} />}
            />
            <Route
              exact
              path="/"
              render={(props) => (
                <Home
                  allTargets={allTargets}
                  setTarget={setTarget}
                  demography={demography}
                  setDemography={setDemography}
                  colors={colors}
                  user={user}
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
                  subTarget={subTarget}
                  setSubTarget={setSubTarget}
                  allTargets={allTargets}
                  states={states}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        <div className="footer">
          <div className="container">
            <div>
              <h1>Quick Links</h1>
              <ul>
                <li>Github</li>
                <li>Some link</li>
                <li>Another link</li>
              </ul>
            </div>
            <div>
              <h1>Developed by:</h1>
              <p>
                Indian Institute of Technology, Delhi <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
