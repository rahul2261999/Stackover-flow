const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load person module
const Person = require("../../models/person");

//load profile module
const Profile = require("../../models/Profile");

// @type   GET
// @type /api/profile
// @desc route for user profile
//@access PRIVATE

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "profile not found" });
        }
        res.json(profile);
      })
      .catch(err => {
        console.log("profile error found" + err);
      });
  }
);

// @type   POST
// @type /api/profile
// @desc rote for save or update profile
//@access  PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValue = {};
    profileValue.user = req.user.id;
    if (req.body.username) profileValue.username = req.body.username;
    if (req.body.website) profileValue.website = req.body.website;
    if (req.body.country) profileValue.country = req.body.country;
    if (req.body.languages)
      profileValue.languages = req.body.languages.split(",");
    //social links
    profileValue.social = {};
    if (req.body.youtube) profileValue.social.youtube = req.body.youtube;
    if (req.body.instagram) profileValue.social.instagram = req.body.instagram;
    if (req.body.twitter) profileValue.social.twitter = req.body.twitter;

    // updating and saving the database

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValue },
            { new: true }
          )
            .then(profile => {
              res.json(profile);
            })
            .catch(err => console.log("profile update error " + err));
        } else {
          Profile.findOne({ username: profileValue.username })
            .then(profile => {
              // username already exists
              if (profile) {
                res.json({ username: "username already exist" });
              }
              // save profile in db
              new Profile(profileValue)
                .save()
                .then(profile => {
                  res.json(profile);
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => console.log(`problem in fetching profile ${err}`));
  }
);

// @type  POST
// @type /api/profile
// @desc Route for workrole
//@access PRIVATE

router.post(
  "/work",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.json({ profile: "profile not exist" });
        }

        const newWorkrole = {
          role: req.body.role,
          company: req.body.company,
          from: req.body.from,
          to: req.body.to,
          courrent: req.body.current,
          details: req.body.details
        };
        profile.workrole.unshift(newWorkrole);
        profile
          .save()
          .then(() => res.json(profile))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

router.delete(
  "/work/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ notFound: "profile not found" });
        }

        const removeWorkrole = profile.workrole
          .map(item => item.id)
          .indexOf(req.params.id);

        profile.workrole.splice(removeWorkrole, 1);

        profile
          .save()
          .then(() => {
            res.json(profile);
          })
          .catch(err => console.log(`workrole unable to delete workrole`));
      })
      .catch(err => console.log(`user id not fetching ${err}`));
  }
);

// @type GET
// @type /api/profile:username
// @desc Username based profile search
//@access PRIVATE

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ username: req.params.username })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ notfound: "user profile not found" });
        }
        res.json(profile);
      })
      .catch(err => console.log(`error in fetching username ${err}`));
  }
);

// @type  DELETE
// @type /api/profile
// @desc deleting user from database
//@access PRIVATE

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(() => {
        res.json({ delete: "sure to delete account" });
      })
      .catch(err => console.log(err));
    Profile.findOneAndRemove({ user: req.user.id })
      .then(
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ sucess: "account deleted" }))
          .catch(err =>
            console.log(`error in deleting the user account ${err}`)
          )
      )
      .catch(err => cosnsole.log(`error in fetching user profile ${err}`));
  }
);

// @type  GET
// @type /api/profile
// @desc Fetching all user from database
//@access PRIVATE

router.get("/everyone/profiles", (req, res) => {
  Profile.find()
    .then(profiles => res.json(profiles))
    .catch(err => console.log(`Problem in fetching all user from database`));
});

module.exports = router;
