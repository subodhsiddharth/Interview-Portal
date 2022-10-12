require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
const User = require("../models/user");
router.post("/createMeeting", (req, res) => {
  interview(req.body, null, res);
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ihar743@gmail.com",
    pass: "aoglfnrkoxmjcrbd",
  },
  port: 465,
});
router.post("/edit/:meetingId", (req, res) => {
  interview(req.body, req.params.meetingId, res);
});
router.post("/check/:meetingId", (req, res) => {
  userAvailable(req.body, req.params.meetingId, res);
});
router.post("/check", (req, res) => {
  userAvailable(req.body, null, res);
});
function sendEmail(title, date, startString, endString, email, meetingId) {
  let html = `<div style={{"padding":"10px","display":"flex","justifyContent":"space-evenly","margin":"5px"}}>
                <div>title :     ${title}</div>
                <div>date:       ${date}</div>
                <div>start at :  ${startString}</div>
                <div>Endt at :   ${endString}</div>
            </div>
          `;
  const subject = meetingId == null ? "New Meeting" : "Meeting Updated";
  let mailOptions = {
    from: "ihar743@gmail.com",
    html: html,
    subject: subject,
  };
  mailOptions.to = email;
  transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
function userAvailable(body, meetingId, res) {
  console.log(body, meetingId);
  let { date, email, startTime, endTime } = body;
  if (!date || !email || !startTime || !endTime) {
    console.log(date, email, startTime, endTime);
    return res.status(422).json({
      error: "Please add all the fields",
    });
  }
  let startString = startTime;
  let endString = endTime;
  startTime = timeToNumber(startString);
  endTime = timeToNumber(endString);
  if (endTime < startTime) {
    return res
      .status(422)
      .json({ error: "end time cannot be smaller than start time" });
  }
  User.findOne({ email: email }).then((savedUser1) => {
    if (!savedUser1) {
      return res.status(422).json({
        error: "Invalid email",
        email: email
      });
    }
    let user1Available = true;

    Meeting.find({
      $or: [{ date: date, users: savedUser1._id }],
    }).then((meetings) => {
      for (meeting of meetings) {
        if (meetingId != null && meetingId == meeting._id) {
          continue;
        }
        if (startTime < meeting.endTime && meeting.startTime < endTime) {
          user1Available = false;
          break;
        }
      }
      if (!user1Available) {
        res.status(422).json({
          error: "User is not available at this time",
        });
      } else {
        res.status(200).json({
          message: "User is available at this time",
        });
      }
    });
  });
}
function doesContainDups(arr) {
  return new Set(arr).size !== arr.length;
}
function interview(body, meetingId, res) {
  let { title, date, startTime, endTime, email1 } = body;
  const emails = email1;
  if (!title || !date || !startTime || !endTime || emails.length < 1) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  if (emails.length < 2) {
    return res.status(422).json({ error: "Please add atleast 2 emails" });
  }
  if (doesContainDups(emails)) {
    return res.status(422).json({ error: "Please add unique emails" });
  }
  let startString = startTime;
  let endString = endTime;
  startTime = timeToNumber(startString);
  endTime = timeToNumber(endString);

  if (endTime < startTime) {
    return res
      .status(422)
      .json({ error: "end time cannot be smaller than start time" });
  }
  User.find({ email: { $in: emails } }).then((savedUsers) => {
    const meeting = new Meeting({
      title,
      date,
      startTime,
      endTime,
      users: savedUsers.map((user) => user._id),
    });
    if (meetingId != null) {
      Meeting.updateOne(
        { _id: meetingId },
        {
          $set: {
            title,
            date,
            startTime,
            endTime,
            users: savedUsers,
          },
        }
      )
        .then((result) => {
          res.json({ meeting: result });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      meeting
        .save()
        .then((result) => {
          res.json({ meeting: result });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    for (email of emails) {
      sendEmail(title, date, startString, endString, email, meetingId);
    }
  });
}

function timeToNumber(sTime) {
  let time = sTime.replace(":", "");
  return Number(time);
}

module.exports = router;
