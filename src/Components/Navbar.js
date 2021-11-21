import React from "react";
import { useHistory } from "react-router-dom";
import httpClient from "../Util/httpClient";
export default function Navbar({ user }) {
  let history = useHistory();
  return (
    <div className="navbar">
      <div className="left">
        <button
          onClick={() => {
            history.push("/");
          }}
        >
          Home
        </button>
        <button
          onClick={() => {
            history.push("/infographics");
          }}
        >
          Dashboard
        </button>
      </div>
      <div className="right">
        {user !== null && <span>Welcome, {user.name}</span>}
        {user === null && (
          <button
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </button>
        )}
        {user !== null && (
          <button
            onClick={() => {
              history.push("/new");
            }}
          >
            Add New
          </button>
        )}
        {user !== null && (
          <button
            onClick={async () => {
              const resp = await httpClient.post("//127.0.0.1:5000/logout");
              window.location.reload();
            }}
          >
            Logout
          </button>
        )}
        {user === null && (
          <button
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
}
