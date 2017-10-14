require("dotenv").config();
const express = require("express");
const app = express();

console.log(process.env.TOKEN);

const PORT = 4000;
app.listen(PORT);
console.log(`Listening on https://localhost:${PORT} ...`);
