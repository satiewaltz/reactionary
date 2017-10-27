import express from "express";
import { main, logError } from "./lambda";

const app = express();

app.get("/:id", async function(req, res) {
  const data = await main(Number(req.params.id)).catch(logError);
  console.log(data);
  res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  res.json(data);
});

app.get("/", async function(req, res) {
  res.send(
    `Reactionary API by Dave Barthly.
Send a request to /api/{#id} to get a resource.
(Example: "https://api.theweb.rocks/1")`
  );
});

export default app;
