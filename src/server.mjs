import express from "express";
import { getSubject, getAllSubjects, logError } from "./lambda";

const app = express();

app.use(function cache(req, res, next) {
  if (process.env.NODE_ENV != "dev") {
    res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  }
  next();
});

app.get("/:id(\\d+)/", async function(req, res) {
  const subject = await getSubject(req.params.id).catch(logError);
  res.status(subject.code).json(subject.data);
});

app.get("/", async function(req, res) {
  const data = await getAllSubjects(req).catch(logError);
  res.json(data);
});

app.get("*", function(req, res) {
  res.status(404).json(`That route doesn't seem to exist.`);
});

export default app;
