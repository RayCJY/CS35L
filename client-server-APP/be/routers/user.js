const express = require("express");
const router = express.Router();
const db = require("../config/db");
const constant = require("../constant/index");

// post a user to the database
router.post("/create", (req, res) => {
  const data = req.body;

  if (!data.username) {
    return res
      .json({
        msg: "username required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.password) {
    return res
      .json({
        msg: "password required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.address) {
    return res
      .json({
        msg: "address required",
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

  if (constant.validType.indexOf(data.type) === -1) {
    return res.json({
      msg: "invalid user type",
      status: "fail",
    });
  }

  // create insert sql
  const sql = `INSERT INTO user (name, password, address, type) VALUES ('${data.username}', '${data.password}', '${data.address}', '${data.type}');`;

  // create user
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      msg: "success create user",
      status: "success",
      data: data
    });
  });
});

// signin
router.post("/signin", (req, res) => {
  const data = req.body;

  if (!data.username) {
    return res
      .json({
        msg: "username required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.password) {
    return res
      .json({
        msg: "password required",
        status: "fail",
      })
      .status(400);
  }

  const sql = `SELECT * FROM user WHERE name='${data.username}' AND password='${data.password}';`;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) {
      return res.json({
        msg: "user not found",
        status: "fail",
      });
    }

    return res.json({
      msg: "success signin",
      status: "success",
      user: data[0],
    });
  });
});

router.get("/drivers", (req, res) => {
  const sql = `SELECT * FROM user WHERE type='Driver';`;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      msg: "success",
      status: "success",
      data: data,
    });
  });
})

router.post("/update", (req, res) => {
  const data = req.body;

  if (!data.id) {
    return res
      .json({
        msg: "user id required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.username) {
    return res
      .json({
        msg: "username required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.password) {
    return res
      .json({
        msg: "password required",
        status: "fail",
      })
      .status(400);
  }

  if (!data.address) {
    return res
      .json({
        msg: "address required",
        status: "fail",
      })
      .status(400);
  }
  
  // create insert sql
  const sql = `UPDATE user SET name='${data.username}', password='${data.password}', address='${data.address}' WHERE id=${data.id};`;

  // create user
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      msg: "success update",
      status: "success",
    });
  });
});

// this should be implemented after signIn logic completed
// should get user id from session, current just get from query
router.get("/info", (req, res) => {
  const data = req.query;

  if (!data.id) {
    return res
      .json({
        msg: "user id required",
        status: "fail",
      })
      .status(400);
  }

  const sql = `SELECT * FROM user WHERE id=${data.id};`;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      msg: "success",
      status: "success",
      user: data[0],
    });
  });
});

module.exports = router;
