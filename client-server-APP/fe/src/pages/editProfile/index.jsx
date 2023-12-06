import React, { useState, useEffect } from "react";
import { useGlobalState, useDispatch } from "../../store";
import request from "../../utils/request";

const EditProfile = () => {
  const { info } = useGlobalState();
  const dispatch = useDispatch();

  //Replace with variables from server
  const [username, setUsername] = useState(info.name);
  const [password, setPassword] = useState(info.password);
  const [address, setAddress] = useState(info.address);
  // const [type, setType] = useState(info.type);
  const [errorMsg, setErrorMsg] = useState(null);

  const types = [
    { value: "Driver", label: "Driver" },
    { value: "Rider", label: "Rider" },
  ];

  const handleSubmit = () => {
    const newInfo = {
      id: info.id,
      username: username,
      password: password,
      address: address,
      // type: type,
    }

    request
      .post("http://localhost:8081/user/update", newInfo)
      .then((res) => {
        if (res.status === "success") {
          dispatch({ type: "SIGNIN", payload: newInfo });

          setErrorMsg("Profile updated successfully");
        } else {
          setErrorMsg("Profile update failed");
        }
      });
  };

  return (
    <div style={{textAlign: "center"}}>
      <h1>Edit Profile</h1>
      <div>
        <h2>Username</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <h2>Password</h2>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <h2>Home Address</h2>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      {/* <div>
        <h2>Type</h2>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((types) => (
            <option key={types.value} value={types.value}>
              {types.label}
            </option>
          ))}
        </select>
      </div> */}
      <button type="submit" onClick={handleSubmit} style={{marginTop: "1rem"}}>
        Submit
      </button>
      <p>{errorMsg}</p>
    </div>
  );
};

export default EditProfile;
