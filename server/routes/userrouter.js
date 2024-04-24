const userRouter = require("express").Router();
const CryptoJS = require("crypto-js");

const Candidate = require("../model/CandidateModel");

//Create User - or register, a simple post request to save user in db
userRouter.post("/register/candidate", (req, res) => {
  const newUser = new Candidate({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: req.body.fullName,
    qualification: req.body.qualification,
    totalExperience: req.body.totalExperience,
    relevantExperience: req.body.relevantExperience,
    noticePeriod: req.body.noticePeriod,
    contact: req.body.contact,
    email: req.body.email,
    currentLocation: req.body.currentLocation,
    appliedPosition: req.body.appliedPosition,
    image: req.body.image,
    status: req.body.status,
    createdAt: req.body.createdAt,
    psychometric: req.body.psychometric,
    quantitative: req.body.quantitative,
    vocabulary: req.body.vocabulary,
    java: req.body.java,
    accounts:req.body.accounts,
    excel:req.body.excel,
    selectedCategory:req.body.selectedCategory,
    state:req.body.state,
    district:req.body.district,
    taluka:req.body.taluka,
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
    role: req.body.role,
    confirmPassword: req.body.confirmPassword
  });


  newUser.save()
    .then((user) => {

      res.json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {

        res.status(409).json({ message: "Email already in use" });
      } else {
        res.status(400).json({ message: "Could not create user" });
      }
    });
})

//Login User
userRouter.post("/api/login", (req, res) => {
  Candidate.findOne({ email: req.body.email })
    .then((user) => {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      else if (decryptedPassword !== req.body.password) {
        res.json({ message: "Incorrect password" });
      } else {
        res.status(200).json(user); //return _id and role as a JSON at least..account Type is a must...in here I return the whole user object
      }
    })
    .catch((err) => res.status(400).json({ message: "Could not login user" }));
});

userRouter.get('/candidates', async (req, res) => {
  const docs = await Candidate.find({ role: "Candidate" });
  res.json(docs)
})

userRouter.get('/candidatesreport', async (req, res) => {
  const docs = await Candidate.find({ role: "Candidate" });
  res.json(docs)
})

userRouter.get('/candidates/:email', async (req, res) => {
  const docs = await Candidate.find({ email: req.params.email });
  res.json(docs)
})

userRouter.get('/candidate/status', async (req, res) => {
  const docs = await Candidate.find({ status: "SELECTED" });
  res.json(docs)
})

userRouter.get("/candidate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findById(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records not found on this ID"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records found",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }

})

//update records
userRouter.put('/candidate/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findByIdAndUpdate(_id, req.body, { new: true });
    if (!result) {
      res.json({
        status: "FAILED",
        message: "record is not updated successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records updated successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})



//Delete records
userRouter.delete("/candidate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findByIdAndDelete(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records is Delete successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records not Delete successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})


module.exports = userRouter;
