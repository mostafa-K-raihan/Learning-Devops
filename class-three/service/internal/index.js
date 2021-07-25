"use strict";

const express = require("express");

// Constants
const PORT = 9090;
const HOST = "0.0.0.0";

// App
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World from Internal Service");
});

app.post("/api/v1/add", (req, res) => {
  const { a, b } = req.body;
  console.log(`a is ${a} and b is ${b}`);
  console.log(`adding ${a} and ${b}`);
  res.send({
    result: parseInt(a) + parseInt(b),
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
