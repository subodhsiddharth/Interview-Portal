require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
const userRoutes = require("./routes/user");
const InterviewRoutes = require("./routes/Interview");
const allInterviewRoutes = require("./routes/AllInterviews");
require("./models/user");
require("./models/meeting");
app.use(morgan("dev"));
app.use(express.json());
app.use(userRoutes);
app.use(InterviewRoutes);
app.use(allInterviewRoutes);

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
