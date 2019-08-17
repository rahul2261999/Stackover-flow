const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

// @type    GET
// @type /api/auth
// @desc just for test
//@access PUBLIC

router.get("/", (req, res) => res.json({ test: "Auth is success" }));

// import schema for person to register

const Person = require("../../models/person");

// @type    POST
// @type /api/auth/register
// @desc route for registration of user
//@access PUBLIC

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res.status(400).json({ emaileror: "user already exist" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // encript password using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

// @type    POST
// @type /api/auth/login
// @desc route for login of user
//@access PUBLIC

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.json("YOu do not register! register first");
      }
      // Load hash from your password DB.
      bcrypt
        .compare(password, person.password)
        .then(isCorrect => {
          if (isCorrect) {
            // res.json({ success: "password match" });
            //payload for user

            const payload = {
              id: person.id,
              name: person.name,
              email: person.email
            };
            jsonwt.sign(
              payload,
              key.secret,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "bearer " + token
                });
              }
            );
          } else {
            res.json({ passwordError: "password is not correct" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

// @type    GET
// @type /api/auth/profile
// @desc route for user profile
//@access PRIVATE

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;
