const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const meeting = require("../models/meeting");
const Meeting = mongoose.model("Meeting");
const User = require("../models/user");
router.get("/allMeetings", (req, res) => {
  //   console.log("Hello");
  // console.log(Meeting);
  Meeting.find()
    .populate("users", "name email")
    .then((meetings) => {
      console.log({ meetings });
      res.json({ meetings });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/meetingDetail/:meetingId", (req, res) => {
  Meeting.findOne({ _id: req.params.meetingId })
    .populate("users", "name email")
    .then((meeting) => {
      res.json({ meeting });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
