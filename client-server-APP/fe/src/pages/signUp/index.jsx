import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../../utils/request";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("Driver");
  const navigate = useNavigate();

  const handleSubmit = () => {
    request
      .post("http://localhost:8081/user/create", {
        username: username,
        password: password,
        address: address,
        type: selectedChoice,
      })
      .then((res) => {
        if (res.status === "success") {
            navigate("/signIn");
        }
      });
  };

  const choices = [
    { value: "Driver", label: "Driver" },
    { value: "Rider", label: "Rider" },
  ];

  return (
    <div  style={{textAlign: "center"}}>
      <h1>UCLA Carpool Connect</h1>
      <div>
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
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <h3>Your Home Address</h3>
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <h3>Driver or Rider</h3>
        <select
          value={selectedChoice}
          onChange={(e) => setSelectedChoice(e.target.value)}
        >
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleSubmit} type="submit" style={{marginTop: "1rem"}}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
