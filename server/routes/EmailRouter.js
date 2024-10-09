const express = require("express");
const emailRouter = new express.Router();
const nodemailer = require("nodemailer");
const Hogan = require("hogan.js");
const fs = require("fs");
const moment = require("moment");
const {
  authenticate,
  checkPermission,
} = require("../middleware/PermissionMiddleware");
//const { dirname } = require("path");

const template = fs.readFileSync("./views/directApplicant.hjs", "utf-8");
const template1 = fs.readFileSync("./views/credentials.hjs", "utf-8")
const template2 = fs.readFileSync("./views/approvalEmail.hjs", "utf-8");
const template3 = fs.readFileSync("./views/slotRequest.hjs", "utf-8")
const template4 = fs.readFileSync("./views/interviewSch.hjs", "utf-8");
const template5 = fs.readFileSync("./views/panelistFeedback.hjs", "utf-8");
const template6 = fs.readFileSync("./views/interviewInvite.hjs", "utf-8");

const compiledTemplate = Hogan.compile(template);
const compiledTemplate1 = Hogan.compile(template1);
const compiledTemplate2 = Hogan.compile(template2);
const compiledTemplate3 = Hogan.compile(template3);
const compiledTemplate4 = Hogan.compile(template4);
const compiledTemplate5 = Hogan.compile(template5);
const compiledTemplate6 = Hogan.compile(template6);

// send mail
emailRouter.post(
  "/user/register",
  // authenticate,
  // checkPermission("job_approve_email"),
  (req, res) => {
    const { role, fullName, email, source, mgrName, mgrEmail, position, reference, selectedCategory, currentLocation, lwd } = req.body;
    // const { confirmPassword } = req.body;
  

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: mgrEmail,
        subject: "Candidate Applied Directly",
        html: compiledTemplate.render({
          role,
          email,
          fullName,
          source,
          mgrName,
          position, lwd, currentLocation, selectedCategory, reference
        }),
        attachments: [
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error });
    }
  }
);

emailRouter.post("/user/credentials", (req, res) => {
  const { role } = req.body;
  const { confirmPassword } = req.body;
  const { email } = req.body;
  const { fullName } = req.body;

  try {

      const transporter = nodemailer.createTransport({
          
          service: "gmail",
          auth: {
              user: "sunitha.chichula@enfuse-solutions.com",
              pass: "lcxlvcycsniwcwek"
          }
      });

      const mailOptions = {
          from: 'sunitha.chichula@enfuse-solutions.com',
          to: email,
          subject: "Enfuse Welcomes You",
          html: compiledTemplate1.render({ role, email, fullName, confirmPassword }),
          attachments: [
              {
                  filename: 'enfuse-logo.png',
                  path: './views/enfuse-logo.png',
                  cid: "enfuse-logo"
              },
              {
                  filename: 'welcome.jpg',
                  path: './views/welcome.jpg',
                  cid: "welcome"
              },
          ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log("Error" + error)
          } else {
              console.log("Email sent:" + info.response);
              res.status(201).json({ status: 201, info })
          }
      })

  } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error })
  }
});

emailRouter.post(
  "/job/approval",
  authenticate,
  checkPermission("job_approve_email"),
  (req, res) => {
    const { position, department, postedBy, jobId } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: "sunitha.chichula@enfuse-solutions.com",
        subject: "Approval Request for New Job Position",
        html: compiledTemplate2.render({
          position,
          department,
          postedBy,
          jobId,
        }),
        attachments: [
          {
            filename: "Recruitment.jpg",
            path: "./views/Recruitment.jpg",
            cid: "recruitment",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error });
    }
  }
);

// //chatbot query
// emailRouter.post("/api/send-query-email", async (req, res) => {
//   const { name, query, department } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//           user: process.env.EMAIL,
//           pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.Email,
//     to: "farahnaz.saiyed@enfuse-solutions.com", 
//     subject: `New Query from ${name}`,
//     text: `Name: ${name}\nQuery: ${query}\nDepartment: ${department}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email: ", error);
//     res.status(500).json({ message: "Failed to send email." });
//   }
// });

//Interview slot request by HR/Admin to Panelist/Ops-manager
emailRouter.post(
  "/slot/request",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { panelistEmail, candidateName, message, postedBy, requestedDateRange } = req.body;

    try {
      // Ensure requestedDateRange is an array with 2 dates
      const fromDate = moment(requestedDateRange[0]).format('DD-MM-YYYY');
      const toDate = moment(requestedDateRange[1]).format('DD-MM-YYYY');

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: panelistEmail,
        subject: "Request for Available Slot",
        html: compiledTemplate3.render({
          candidateName, 
          message, 
          postedBy, 
          fromDate,  // Pass formatted fromDate
          toDate     // Pass formatted toDate
        }),
        attachments: [
          {
            filename: "Recruitment.jpg",
            path: "./views/Recruitment.jpg",
            cid: "recruitment",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
          res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);



//send slot booked mail to Panelist
emailRouter.post(
  "/interview-slot-booked",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, candidatePosition, panelistEmail, panelistName, roundName, interviewDt } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: panelistEmail,
        
        subject: "Interview Slot Blocked",
        html: compiledTemplate4.render({
          candidateName, candidateEmail, candidatePosition, roundName, interviewDt, panelistName,   
        }),
        attachments: [
          {
            filename: "Recruitment.jpg",
            path: "./views/Recruitment.jpg",
            cid: "recruitment",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error });
    }
  }
);

//interview invite to candidate
emailRouter.post(
  "/interview-scheduled",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, candidatePosition, panelistEmail, panelistName, roundName, interviewDt}= req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: candidateEmail,
        subject: "Interview Slot Blocked",
        html: compiledTemplate6.render({
          candidateName, 
          candidateEmail, 
          candidatePosition, 
          roundName, 
          interviewDt, 
          panelistName,
        
        }),
        attachments: [
          {
            filename: "Recruitment.jpg",
            path: "./views/Recruitment.jpg",
            cid: "recruitment",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error });
    }
  }
);



//send candidate status to corresponding HR of the candidate
emailRouter.post(
  "/panelist-feedback",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail,postedBy, candidatePosition, panelistName, roundName, interviewDate, feedback, hrEmail,hrName, status } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: hrEmail,
        
        subject: `Update on Interview Feedback ${candidateName} for ${candidatePosition}`,
        html: compiledTemplate5.render({
          candidateName, candidateEmail, candidatePosition, roundName, interviewDate, panelistName, feedback, postedBy, status, hrName
        }),
        attachments: [
          {
            filename: "Recruitment.jpg",
            path: "./views/Recruitment.jpg",
            cid: "recruitment",
          },
          {
            filename: "welcome.jpg",
            path: "./views/welcome.jpg",
            cid: "welcome",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({ status: 201, info });
        }
      });
    } catch (error) {
      console.log("Error" + error);
      res.status(401).json({ status: 401, error });
    }
  }
);

module.exports = emailRouter;
