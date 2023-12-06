import React, { useState, useEffect } from "react";
import request from "../../utils/request";
import "./index.css"
import { useGlobalState, useDispatch } from "../../store";
import { days, times } from "../../utils/constants";

const CustomRow = ({ fetchData, time, books }) => {
  return (
    <tr>
      <td>{time}</td>
      {days.map((day) => {
        return <CustomCell fetchData={fetchData} key={day+time} day={day} time={time} books={books} />;
      })}
    </tr>
  )
}

const CustomCell = ({ fetchData, day, time, books }) => {
  const info = books.find((book) => book.day === day && book.time === time);

  const cancelBook = () => {
    const result = window.confirm(`Do you want to cancel your ride with ${info.name} on ${day} at ${time}?`)

    if (!result) {
      return
    }

    request.post("http://localhost:8081/trip/cancel", {
      tripID: info.id
    }).then((response) => {
      if (response.status === "success") {
        fetchData()
        console.log("success")
      }
    })
  }

  if (info) {
    return (
      <td className="infoCell" onClick={cancelBook}>
        Ride with {info.name}
      </td>
    )
  }
  
  return (<td></td>)
};

const Schedule = () => {
  const { info } = useGlobalState();
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

  const fetchData = () => {
    request
      .post("http://localhost:8081/trip/schedule", {
        userID: info.id,
        type: info.type,
      })
      .then((response) => {
        if (response.status === "success") {
          setBooks(response.data);
        }
      })
      .catch((error) => {
        setError(error.response ? error.response.data : error.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div style={{textAlign: "center"}}>
      <h1>Schedule View Page</h1>
      <table border="15"  cellSpacing="0">
        <thead>
          <tr>
            <td></td>
            <th> Monday </th>
            <th> Tuesday </th>
            <th> Wednesday </th>
            <th> Thursday </th>
            <th> Friday </th>
          </tr>
        </thead>
        <tbody>
          {times.map((time) => {
            return <CustomRow fetchData={fetchData} time={time} books={books} key={time}/>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
