import express from "express";
import { getSubject, getAllSubjects, logError } from "./lambda";

const app = express();

app.use(function cache(req, res, next) {
  if (process.env.NODE_ENV != "dev") {
    res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  }
  next();
});

app.get("/:id", async function(req, res) {
  const data = await getSubject(req.params.id).catch(logError);
  res.json(data);
});

app.get("/", async function(req, res) {
  const data = await getAllSubjects(req).catch(logError);
  res.json(data);
});

export default app;
