const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load person module
const Person = require("../../models/person");

//load profile module
const Profile = require("../../models/Profile");

//load question module
const Question = require("../../models/Question");

// @type   POST
// @route /api/question
// @desc route for submit question
//@access PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = {
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name
    };

    new Question(newQuestion)
      .save()
      .then(question => res.json(question))
      .catch(err => console.log(`problem in save question ${err}`));
  }
);

// @type   DELETE
// @route /api/question/
// @desc route for deleting the question
//@access  Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (question.user.toString() === req.user.id.toString()) {
              Question.findByIdAndRemove(req.params.id)
                .then(question => {
                  res.json({ delete: "Question deleted successfully" });
                })
                .catch(err => console.log(err));
            } else {
              res.json({ notdelete: "user not auth to delete this question" });
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @type   DELETE
// @route /api/question/
// @desc route for deleting all the question
//@access  Private

router.delete(
  "/allquestion/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find({ user: req.user.id })
      .remove()
      .then(question => res.json({ allquestion: "all question delete" }))
      .catch(err => console.log(err));
  }
);

// @type   GET
// @type /api/question
// @desc route for all question
//@access  PUBLIC

router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(question => {
      res.json(question);
    })
    .catch(() => res.json({ noquestion: `no question available` }));
});

// @type   POST
// @route /api/question/answers
// @desc route for answer
//@access  Private

router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          text: req.body.text,
          name: req.body.name
        };

        question.answer.unshift(newAnswer);
        question
          .save()
          .then(question => {
            res.json(question);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @type   POST
// @route /api/question/upvotes
// @desc route for upvotes
//@access  Private

router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvote.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              const deleteuser = question.upvote
                .map(item => item.user)
                .indexOf(req.user.id);
              question.upvote.splice(deleteuser, 1);
              question
                .save()
                .then(question => {
                  res.json(question);
                })
                .catch();
            } else {
              question.upvote.unshift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(`error in fetching profile ${err}`));
  }
);

module.exports = router;
