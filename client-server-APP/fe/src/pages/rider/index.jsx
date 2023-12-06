import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useGlobalState } from "../../store";
import { getLocation } from "../../utils/location";
import { days, times } from "../../utils/constants";
import request from "../../utils/request";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

const wrapperStyle = {
  textAlign: "center",
  width: "60%",
  display: "flex",
  flexDirection: "column",
};

const Rider = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAagYhKsf953bG7ul1LSawNoNCxsE6CWMQ",
  });
  
  const { info } = useGlobalState();
  const [map, setMap] = useState(null);
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(times[0]);
  const [type, setType] = useState("departure");
  const [driver, setDriver] = useState(0);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [driverList, setDriverList] = useState([]);
  const [current, setCurrent] = useState(null);

  const [center, setCenter] = useState({
    lat: 34.06837609821264,
    lng: -118.44190197846763,
  });

  const handleSubmit = () => {
    if (!driver) {
      alert("Please select a driver");
      return;
    }

    if (!arrival && !departure) {
      alert("Please select a location");
      return;
    }

    const newTrip = {
      riderId: info.id,
      driverId: driver.id,
      day: day,
      time: time,
      departure: departure,
      arrival: arrival,
    }

    // create new trip
    request.post("http://localhost:8081/trip/create", newTrip).then((response) => {
      if (response.status === "success") {
        alert("Trip created successfully");
      }
    })
  }

  // get current location and set center
  useEffect(() => {
    // get available driver list
    request.get("http://localhost:8081/user/drivers").then((response) => {
      if (response.status === "success") {
        setDriverList(response.data);

        if (response.data.length > 0) {
          setDriver(response.data[0].id)
        }
      }
    });
  }, []);

  const onLoad = useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);

    setMap(map);

    getLocation()
      .then((location) => {
        if (location) {
          setCenter(location);
          setCurrent(location)
        }
      })
      .catch((error) => {
        console.error(error);
      });

    
  }, []);

  const handleDriverSelect = (id) => {
    const selectedDriver = driverList.find((driver) => driver.id === parseInt(id));
    setDriver(selectedDriver);
  }

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMapClick = (e) => {
    const target = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    console.log(target)
    if (type === 'departure') {
      setDeparture(target)
    } else {
      setArrival(target)
    }
  }

  return isLoaded ? (
    <div style={wrapperStyle}>
      <h1>UCLA Carpool Connect</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ marginRight: "2rem" }}>
          <h3>Day</h3>
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {days.map((day) => (
              <option value={day} key={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "2rem" }}>
          <h3>Time</h3>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {times.map((time) => (
              <option value={time} key={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "2rem" }}>
          <h3>LocationType</h3>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="departure">departure</option>
            <option value="arrival">arrival</option>
          </select>
        </div>
        <div>
          <h3>Driver</h3>
          <select value={driver.id} onChange={(e) => handleDriverSelect(e.target.value)}>
            {driverList.map((driver) => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {current && <Marker label="Current" position={current}></Marker>}
        {departure && <Marker label="Departure" position={departure}></Marker>}
        {arrival && <Marker label="Arrive" position={arrival}></Marker>}
      </GoogleMap>

      <div style={{ marginTop: "1rem" }}>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Rider;
