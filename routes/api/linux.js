const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const router = express.Router();

//import linux model
const Linux = require("../../models/Linux");
//import person model
const Person = require("../../models/Profile");
// import profile model
const Profile = require("../../models/Profile");

//@type POST
//@route  /api/linux/
//desc route for ask question
//access PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const linuxQuestion = {
      user: req.user.id,
      name: req.user.name
    };
    linuxQuestion.question = [
      {
        description: req.body.description,
        code: req.body.code,
        error: req.body.error
      }
    ];

    new Linux(linuxQuestion)
      .save()
      .then(linux => {
        res.json(linux);
      })
      .catch(err => console.log(`error in saving linux question ${err}`));
  }
);

//@type GET
//@route  /api/linux/
//desc route for get all question from db
//access PRIVATE

router.get("/", (req, res) => {
  Linux.find()
    .then(linux => {
      res.json(linux);
    })
    .catch(err => console.log);
});

//@type GET
//@route  /api/linux/myquestion
//desc route for the particular user question
//access PRIVATE

router.get(
  "/myquestion",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.find({ user: req.user.id })
      .then(linux => {
        res.json(linux);
      })
      .catch(err => console.log(err));
  }
);

//@type DELETE
//@route  /api/linux/myquestion
//desc route for delete particular user all question
//access PRIVATE

router.delete(
  "/myquestion",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.find({ user: req.user.id })
      .remove()
      .then(linux => res.json({ allquestion: "all question deleted" }))
      .catch(err => console.log(err));
  }
);

//@type DELETE
//@route  /api/linux/myquestion
//desc route for delete single question of user
//access PRIVATE

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.findById(req.params.id)
      .then(linux => {
        if (linux.user.toString() === req.user.id.toString()) {
          Linux.findByIdAndRemove(req.params.id)
            .then(question => {
              res.json({ delete: "question deleted successfully" });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
);

//@type POST
//@route  /api/linux/question/upvote
//desc route for upvote question
//access PRIVATE

router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.findById(req.params.id)
      .then(linux => {
        if (
          linux.question.filter(item => {
            item.upvote.filter(
              item => item.user.toString() === req.user.id.toString()
            ).length > 0;
          })
        ) {
          const deleteUpvote = linux.question.filter(item =>
            item.upvote.map(item => item.user).indexOf(req.user.id)
          );
          linux.question.filter(item => {
            item.upvote.splice(deleteUpvote, 1);
          });
          linux
            .save()
            .then(upvote => {
              res.json({ removeUpvote: "upvote remove" });
            })
            .catch(err => console.log(err));
        } else {
          linux.question.filter(item =>
            item.upvote.unshift({
              user: req.user.id,
              name: req.user.name
            })
          );
          linux.save().then(upvote => {
            res.json({ upvote: "user upvote successfully" });
          });
        }
      })
      .catch(err => console.log(err));
  }
);

//@type POST
//@route  /api/linux/answer
//desc route for answer question
//access PRIVATE

router.post(
  "/answer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.findById(req.params.id)
      .then(linux => {
        const linuxAnswer = {
          user: req.user.id,
          name: req.user.name,
          text: req.body.text
        };

        linux.answer.unshift(linuxAnswer);
        linux
          .save()
          .then(answer => res.json(answer))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type DELETE
//@route  /api/linux/answer/
//desc route for upvote answer
//access PRIVATE

router.delete(
  "/answer/:id/:answerid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.findById(req.params.id)
      .then(linux => {
        const getAnswer = linux.answer
          .map(item => item.id)
          .indexOf(req.params.answerid); //  return the index of requested answer id

        // validating the user has access to delete answer
        if (linux.answer[getAnswer].user == req.user.id) {
          linux.answer.splice(getAnswer, 1); // delete answer
          linux
            .save() // saving DB
            .then(save => res.json({ delte: "Answer deleted succesfully" }))
            .catch(err => console.log(err));
        } else {
          res.json({ notallowed: "user not allowed" });
        }
      })
      .catch(err => console.log(err));
  }
);

//@type POST
//@route  /api/linux/answer/upvote
//desc route for upvote answer
//access PRIVATE

router.post(
  "/answer/upvote/:id/:answerid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Linux.findById(req.params.id)
      .then(linux => {
        const array = linux.answer
          .map(item => item.id)
          .indexOf(req.params.answerid);
        if (
          linux.answer[array].upvote.filter(
            item => item.user.toString() === req.user.id.toString()
          ).length > 0
        ) {
          const removeUpvote = linux.answer[array].upvote
            .map(map => map.user)
            .indexOf(req.user.id);
          linux.answer[array].upvote.splice(removeUpvote, 1);
          linux
            .save()
            .then(save => {
              res.json({ remove: "answer upvote remove" });
            })
            .catch(err => console.log(err));
        } else {
          linux.answer[array].upvote.unshift({
            user: req.user.id,
            name: req.user.name
          });
          linux
            .save()
            .then(save => {
              res.json({ upvote: "user upvote successfully" });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
