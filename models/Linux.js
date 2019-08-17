const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const linuxQuestion = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  name: {
    type: String,
    required: true
  },
  question: [
    {
      description: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      error: {
        type: String,
        required: true
      },
      upvote: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
          },
          name: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],

  answer: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      name: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },

      upvote: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
          },
          name: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = linux = mongoose.model("linuxQuestion", linuxQuestion);
