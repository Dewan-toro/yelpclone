const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

//models
const Place = require("./models/place");

//connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((result) => {
    console.log("connect to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/seed/place", async (req, res) => {
  const place = new Place({
    title: "Empire State Building",
    price: "$58000",
    description: "A greate building",
    location: "Jakarta, INA",
  });

  await place.save();
  res.send(place);
});

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});