import { React, useState } from "react";
import httpClient from "../Util/httpClient";
import { useHistory } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();
  const logInUser = async () => {
    const resp = await httpClient.post("//127.0.0.1:5000/login", {
      email: email,
      password: password,
    });
    if (resp.status === 200) window.location.href = "/";
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1>Log into your account</h1>
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
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="my-button text-box"
            />
          </div>
          <div className="submit-button-container">
            <button className="nav-button" type="button" onClick={logInUser}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
