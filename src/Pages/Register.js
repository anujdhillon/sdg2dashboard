import { React, useEffect, useState } from "react";
import httpClient from "../Util/httpClient";
import Dropdown from "../Components/Dropdown";
import { BASE_URL } from "../Util/base";
export default function Register({ states }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState(0);
  const [state, setState] = useState(0);
  const [districts, setDistricts] = useState(null);
  const [groups, setGroups] = useState(null);
  const [group, setGroup] = useState(0);
  const fetchDistricts = async (id) => {
    const resp = await httpClient.get(BASE_URL + "districts/" + id);
    console.log(resp);
    setDistricts(resp.data);
  };
  const fetchGroups = async (id) => {
    const resp = await httpClient.get("//127.0.0.1:5000/groups");
    console.log(resp);
    setGroups(resp.data);
  };

  useEffect(() => {
    fetchDistricts(states[state].id);
  }, [state]);

  useEffect(() => {
    if (groups == null) fetchGroups();
  }, [groups]);

  const registerUser = async () => {
    const resp = await httpClient.post("//127.0.0.1:5000/register", {
      email: email,
      password: password,
      name: name,
      district_id: districts[district].id,
      phone: phone,
      group: groups[group].id,
    });
    console.log(states);
    console.log(resp);
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1>Register your healthcare center</h1>
        <form>
          <div>
            <label>Email: </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-button text-box"
            />
          </div>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-button text-box"
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="my-button text-box"
            />
          </div>
          <div>
            <label>Phone: </label>
            <input
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="my-button text-box"
            />
          </div>
          {groups && (
            <Dropdown
              list={groups.map((item) => item.name)}
              label={"Select Type"}
              displayed={group}
              setDisplayed={setGroup}
            />
          )}
          {states && (
            <Dropdown
              list={states.map((item) => item.name)}
              label={"Select State"}
              displayed={state}
              setDisplayed={setState}
            />
          )}
          {districts && (
            <Dropdown
              list={districts.map((item) => item.name)}
              label={"Select District"}
              displayed={district}
              setDisplayed={setDistrict}
            />
          )}
          <div className="submit-button-container">
            <button type="button" className="nav-button" onClick={registerUser}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
