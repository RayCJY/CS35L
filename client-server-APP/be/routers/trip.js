const express = require("express");
const router = express.Router();
const db = require("../config/db");
const constant = require("../constant/index");

// create trip
router.post("/create", (req, res) => {
  const data = req.body;

  if (!data.riderId) {
    return res
      .json({
        msg: "riderID required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.driverId) {
    return res
      .json({
        msg: "driverID required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.departure) {
    return res
      .json({
        msg: "departure required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.arrival) {
    return res
      .json({
        msg: "arrival required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.day) {
    return res
      .json({
        msg: "date required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.time) {
    return res
      .json({
        msg: "time required",
        status: "fail",
      })
      .status(400);
  }

  // parse obj into string to store
  const departure = `${data.departure.lat},${data.departure.lng}`;
  const arrival = `${data.arrival.lat},${data.arrival.lng}`;

  const sql = `INSERT INTO trip (riderID, driverID, time, day, status, departure, arrival) VALUES (${data.riderId}, ${data.driverId}, '${data.time}', '${data.day}', 'requested', '${departure}', '${arrival}')`;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .json({
          msg: err,
          status: "fail",
        })
        .status(400);
    }

    return res
      .json({
        msg: "success create trip",
        status: "success",
      })
      .status(200);
  });
});

router.post("/cancel", (req, res) => {
  const data = req.body;

  if (!data.tripID) {
    return res
      .json({
        msg: "tripID required",
        status: "fail",
      })
      .status(400);
  }

  // delete the trip
  const sql = `DELETE FROM trip WHERE id = ${data.tripID}`;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .json({
          msg: err,
          status: "fail",
        })
        .status(400);
    }

    return res
      .json({
        msg: "success cancel trip",
        status: "success",
      })
      .status(200);
  });
});

// for driver to accept the trip
// should change the trip status
router.post("/accept", (req, res) => {
  const data = req.body;

  if (!data.tripID) {
    return res
      .json({
        msg: "tripID required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.driverID) {
    return res
      .json({
        msg: "driverID required",
        status: "fail",
      })
      .status(400);
  }

  const sql = `UPDATE trip SET status = 'accepted', driverID = ${data.driverID} WHERE id = ${data.tripID}`;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .json({
          msg: err,
          status: "fail",
        })
        .status(400);
    }

    return res.json({
      msg: "update success",
      status: "success",
    });
  });
});

router.post("/schedule", (req, res) => {
  const data = req.body;

  if (!data.userID) {
    return res
      .json({
        msg: "driverID or  required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.type) {
    return res
      .json({
        msg: "type required",
        status: "fail",
      })
      .status(400);
  }

  let sql = "";
  if (data.type === "Driver") {
    // get the given driver's trip accepted
    sql = `SELECT trip.*, user.name FROM trip INNER JOIN user ON trip.riderID = user.id WHERE trip.driverID = ${data.userID} AND trip.status = 'accepted'`;
  } else {
    // get the given rider's trip accepted
    sql = `SELECT trip.*, user.name FROM trip INNER JOIN user ON trip.driverID = user.id WHERE trip.riderID = ${data.userID} AND trip.status = 'accepted'`;
  }

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .json({
          msg: err,
          status: "fail",
        })
        .status(400);
    }

    return res
      .json({
        msg: "success get schedule",
        status: "success",
        data: result,
      })
      .status(200);
  });
});

// get the given driver's trip to be accepted
router.post("/books", (req, res) => {
  const data = req.body;

  if (!data.driverID) {
    return res
      .json({
        msg: "driverID required",
        status: "fail",
      })
      .status(400);
  }

  // select trip and driver info

  const sql = `SELECT * FROM trip WHERE driverID = ${data.driverID} AND status = 'requested'`;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .json({
          msg: err,
          status: "fail",
        })
        .status(400);
    }

    result.forEach((item) => {
        const [startLat, startLng] = item.departure.split(",")
        const [endLat, endLng] = item.arrival.split(",")
        item.departure = {
            lat: parseFloat(startLat),
            lng: parseFloat(startLng)
        }
        item.arrival = {
            lat: parseFloat(endLat),
            lng: parseFloat(endLng)
        }
    })

    return res
      .json({
        msg: "success get books",
        status: "success",
        data: result,
      })
      .status(200);
  });
});

module.exports = router;
