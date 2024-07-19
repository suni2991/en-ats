//
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const emailRouter = require("./routes/EmailRouter");
const jobRouter = require("./routes/JobPostRouter.js");
const userRouter = require("./routes/userrouter.js");

const path = require("path");
const multer = require("multer");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// files inside uploads make accesible globaly by /images
app.use("/assets", express.static("uploads"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.URL);
  await mongoose.connection.db
    .collection("candidates")
    .createIndex({ email: 1 }, { unique: true });

  console.log("db connected");
}

main().catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/login") {
//     next();
//   } else if (req.originalUrl === "/viewjobs") {
//     next();
//   } else {
//     CheckTokenMiddleware(req, res, next);
//   }
// });

app.use(userRouter);
app.use(emailRouter);
app.use(jobRouter);

const imageFilter = (req, file, cb) => {
  let filename = file.originalname;
  let fileExtension = filename.slice(
    filename.lastIndexOf("."),
    filename.length
  );
  if (
    fileExtension === ".png" ||
    fileExtension === ".jpg" ||
    fileExtension === ".jpeg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "file format not supported. Supported file types are png, jpg, jpeg"
      ),
      false
    );
  }
};

const fileFilter = (req, file, cb) => {
  let filename = file.originalname;
  let fileExtension = filename.slice(
    filename.lastIndexOf("."),
    filename.length
  );
  if (
    fileExtension === ".pdf" ||
    fileExtension === ".doc" ||
    fileExtension === ".txt"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "file format not supported. Supported file types are pdf, doc, txt"
      ),
      false
    );
  }
};

let timeValue = 0;
let fileName = "";

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = originalName.slice(
      originalName.lastIndexOf("."),
      originalName.length
    );
    timeValue = Date.now();
    fileName = `${file.fieldname}-${timeValue}${fileExtension}`;
    cb(null, fileName);
  },
});

const storageResume = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = originalName.slice(
      originalName.lastIndexOf("."),
      originalName.length
    );
    timeValue = Date.now();
    fileName = `${file.fieldname}-${timeValue}${fileExtension}`;
    cb(null, fileName);
  },
});

const uploadImage = multer({
  storage: storageImage,
  fileFilter: imageFilter,
}).single("image");

const uploadResume = multer({
  storage: storageResume,
  fileFilter: fileFilter,
}).single("resume");

app.post("/upload/image", uploadImage, (req, res) => {
  res.send({
    uploadedFile: "/assets/images/" + fileName,
  });
});

app.post("/upload/resume", uploadResume, (req, res) => {
  res.send({
    uploadedFile: "/assets/resumes/" + fileName,
  });
});

app.listen(5040, () => {
  console.log("server started at 5040");
});
