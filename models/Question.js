const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },

  textone: {
    type: String,
    required: true
  },

  texttwo: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  upvote: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      }
    }
  ],

  answer: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = question = mongoose.model("myquestion", Question);
