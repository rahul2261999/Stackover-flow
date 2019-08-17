const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: {
    type: String,
    require: true
  },

  email: {
    type: String,
    require: true
  },

  password: {
    type: String,
    require: true
  },
  username: {
    type: String
  },
  profilepic: {
    type: String,
    default: "https://learncodeonline.in/manicon.png"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = person = mongoose.model("myPerson", personSchema);
