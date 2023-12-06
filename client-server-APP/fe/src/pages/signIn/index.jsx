// signin.jsx
import React, { useState, useEffect } from "react";
import request from "../../utils/request";
import { useDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import "./index.css";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleSignIn = () => {
    request
      .post("http://localhost:8081/user/signin", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (
          !(response && response.status === "success")
        ) {
          setErrorMsg("Login failed");
          return;
        }
        const userData = response.user;
        dispatch({ type: "SIGNIN", payload: userData });

        // redirect to /schedule
        navigate('/schedule')
      })
      .catch((error) => {
        console.error(error.response ? error.response.data : error.message);
      });
  };

  return (
    <div style={{textAlign: "center"}}>
      <div>
        <h1>UCLA Carpool Connect</h1>
        <h3>Username</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <h3>Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <div>
        <button type="submit" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
      {errorMsg && (
        <div>
          <p>{errorMsg}</p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
