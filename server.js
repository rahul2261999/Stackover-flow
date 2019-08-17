const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

//middlware for bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//bring all routes

const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");
const linux = require("./routes/api/linux");

// mongo configuration
const db = require("./setup/myurl").mongoURL;

// connecting database

mongoose
  .connect(db)
  .then(() => console.log("MOngoDB connected successfully"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//configuring passport

require("./strategy/jsonjwtstrategy")(passport);

//actual route

app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/question", question);
app.use("/api/linux", linux);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
