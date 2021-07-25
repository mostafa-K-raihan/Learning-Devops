"use strict";

const { default: axios } = require("axios");
const express = require("express");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";
const config = {
  url: {
    internal: "http://172.17.0.3:9090",
  },
};
// App
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World from External Service");
});

app.get("/api/v1/add", async (req, res) => {
  console.log(
    `Request Received in External Service in route 
      "api/v1/add"
    with params ${JSON.stringify(req.query)}`
  );
  console.log(
    "Sending Process Request in Internal Service: " + config.url.internal
  );

  try {
    const internalResponse = await axios.post(
      `${config.url.internal}/api/v1/add`,
      {
        a: req.query.a,
        b: req.query.b,
      }
    );
    res.send({
      a: req.query.a,
      b: req.query.b,
      result: internalResponse.data.result,
    });
  } catch (err) {
    res.send("Something went wrong " + err);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
