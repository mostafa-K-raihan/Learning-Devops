'use strict';

const express = require('express');

const HOST = '0.0.0.0';
const PORT = '8080';

const app = express();

app.get('/', (req, res) => {
  console.log('Getting a request');
  res.send('Hello from server');
});

app.listen(PORT, () => {
  console.log(`server listening in ${HOST}:${PORT}`);
});
