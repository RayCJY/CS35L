import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useGlobalState } from "../../store";
import { getLocation } from "../../utils/location";
import "./index.css"
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

const RequestList = ({ setCenter, setMarker }) => {
  const [books, setBooks] = useState([]);
  const { info } = useGlobalState()

  const fetchData = () => {
    request.post("http://localhost:8081/trip/books", {
      driverID: info.id
    }).then((response) => {
      if (response.status === 'success') {
        setBooks(response.data)
      }
    })
  }

  const check = (book) => {
    request.post("http://localhost:8081/trip/accept", {
      tripID: book.id,
      driverID: info.id
    }).then((response) => {
      if (response.status === 'success') {
        alert("accept success")
        fetchData()
      }
    })
  }

  // move map when driver click
  const moveCenter = (target) => {
    setMarker(target)
    setCenter(target)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <table border="15" cellSpacing="0">
      <thead>
        <tr>
          <th>Index</th>
          <th>Day</th>
          <th>Time</th>
          <th>Arrive</th>
          <th>Departure</th>
          <th>Accept</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => {
          return (
            <tr key={book.day+book.time}>
              <td>{index}</td>
              <td>{book.day}</td>
              <td>{book.time}</td>
              <td className="check" onClick={() => moveCenter(book.arrival)}>Check</td>
              <td className="check" onClick={() => moveCenter(book.departure)}>Check</td>
              <td className="check" onClick={() => check(book)}>Accept</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
};

const Driver = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAagYhKsf953bG7ul1LSawNoNCxsE6CWMQ",
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 34.06837609821264,
    lng: -118.44190197846763,
  });
  const [marker, setMarker] = useState(null)

  const onLoad = useCallback(function callback(map) {
    setMap(map);

    getLocation()
      .then((location) => {
        if (location) {
          setCenter(location);
          setMarker(location);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div style={wrapperStyle}>
      <h1>UCLA Carpool Connect</h1>
      <RequestList setCenter={setCenter} setMarker={setMarker}/>
      <h3>Map</h3>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {marker && <Marker label="target" position={marker}></Marker>}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default Driver;
