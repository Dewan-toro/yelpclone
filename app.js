const ejsMate = require("ejs-mate");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const ErrorHandler = require("./utils/ErrorHandler");
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const mongoose = require("mongoose");
const app = express();
const hereMaps = require("./utils/hereMaps");

//connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((result) => {
    console.log("connect to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.get("/", async (req, res) => {
  const location = "Pantai Kuta, Kuta, Badung Regency, Bali";
  const reqLocation = await hereMaps.geocode(location);
  console.log(reqLocation);
  res.render("home");
});

app.use("/", require("./routes/auth"));
app.use("/places", require("./routes/places"));
app.use("/places/:place_id/reviews", require("./routes/reviews"));

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
