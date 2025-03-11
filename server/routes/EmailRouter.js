const express = require("express");
const emailRouter = new express.Router();
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const Hogan = require("hogan.js");
const fs = require("fs");
const moment = require("moment");
const {
  authenticate,
  checkPermission,
} = require("../middleware/PermissionMiddleware");
const Candidate = require("../model/CandidateModel");
//const { dirname } = require("path");

const template = fs.readFileSync("./views/directApplicant.hjs", "utf-8");
const template1 = fs.readFileSync("./views/credentials.hjs", "utf-8")
const template2 = fs.readFileSync("./views/approvalEmail.hjs", "utf-8");
const template3 = fs.readFileSync("./views/slotRequest.hjs", "utf-8")
const template4 = fs.readFileSync("./views/interviewSch.hjs", "utf-8");
const template5 = fs.readFileSync("./views/panelistFeedback.hjs", "utf-8");
const template6 = fs.readFileSync("./views/interviewInvite.hjs", "utf-8");
const template7 = fs.readFileSync("./views/shortlistEmail.hjs", "utf-8");
const template8 = fs.readFileSync("./views/rejectionEmail.hjs", "utf-8");
const template9 = fs.readFileSync("./views/acknowledgeEmail.hjs", "utf-8");
const template10 = fs.readFileSync("./views/postApprovalEmail.hjs", "utf-8");
const compiledTemplate = Hogan.compile(template);
const compiledTemplate1 = Hogan.compile(template1);
const compiledTemplate2 = Hogan.compile(template2);
const compiledTemplate3 = Hogan.compile(template3);
const compiledTemplate4 = Hogan.compile(template4);
const compiledTemplate5 = Hogan.compile(template5);
const compiledTemplate6 = Hogan.compile(template6);
const compiledTemplate7 = Hogan.compile(template7);
const compiledTemplate8 = Hogan.compile(template8);
const compiledTemplate9 = Hogan.compile(template9);
const compiledTemplate10 = Hogan.compile(template10);

// send mail
emailRouter.post(
  "/api/user/register",
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
        subject: `Received Direct Application for ${position}`,
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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

emailRouter.post(
  "/api/user/acknowledgement",
  // authenticate,
  // checkPermission("job_approve_email"),
  (req, res) => {
    const { fullName, email, position } = req.body;
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
        to: email,
        subject: `Thank you for your application for the role of ${position}`,
        html: compiledTemplate9.render({
          fullName,
          position
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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

emailRouter.post("/api/user/credentials", async (req, res) => {
  const { candidates } = req.body;
  const { role } = req.body;
  const { confirmPassword } = req.body;
  const { email } = req.body;
  const { fullName } = req.body;

  const normalizeCandidate = async (candidate) => {
    try {

      const mgrName = candidate['HR Name'];
      console.log('mgrName', mgrName);
      const manager = await Candidate.findOne({
        fullName: mgrName,
        role: 'HR'
      });

      const mgrEmail = manager ? manager.email : null;
      console.log('mgrEmail',mgrEmail);
      
      const encryptedPassword = CryptoJS.AES.encrypt(
        candidate.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString();

      return {
        position: candidate['Role/Designation'],
        email: candidate['Email ID'],
        password: encryptedPassword,
        confirmPassword: candidate.password,
        fullName: candidate['Candidate Name'],
        mgrName: mgrName,
        mgrEmail: mgrEmail
      }
    } catch (err) {
      console.error('Error in normalizeCandidate:', err);
      return null; // Return null to prevent breaking the loop
    }
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Check if multiple candidates are provided
    if (Array.isArray(candidates) && candidates.length > 0) {
      console.log("Bulk email processing started...");

      // Sending bulk emails
      const emailPromises = candidates.map(async (candidate) => {

        const normalizedCandidate = await normalizeCandidate(candidate);
        const { role, email, confirmPassword, fullName, mgrEmail } = normalizedCandidate;

        const mailOptions = {
          from: process.env.EMAIL,
          // to: email, // Candidate's email
          to: email, // Manager's email
          cc: mgrEmail,
          subject: "Enfuse Welcomes You",
          html: compiledTemplate1.render({ role, email, fullName, confirmPassword }),
          attachments: [
            {
              filename: "enfuse-logo.png",
              path: "./views/enfuse-logo.png",
              cid: "enfuse-logo"
            },
            {
              filename: "welcome.jpg",
              path: "./views/welcome.jpg",
              cid: "welcome"
            }
          ]
        };

        return transporter.sendMail(mailOptions);
      });

      // Execute all email promises
      const results = await Promise.allSettled(emailPromises);

      // Filter success & failed emails
      const successfulEmails = results.filter(result => result.status === "fulfilled");
      const failedEmails = results.filter(result => result.status === "rejected");

      // console.log(`${successfulEmails.length} bulk emails sent successfully.`);
      // console.log(`${failedEmails.length} bulk emails failed.`);

      return res.status(201).json({
        status: 201,
        message: `${successfulEmails.length} bulk emails sent successfully.`,
        failedEmails: failedEmails.map(fail => fail.reason)
      });

      // return res.status(400).json({ status: 400, message: "No valid candidates found for email processing." });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: mgrEmail,
      cc: mgrEmail,
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
        {
          filename: "enfuse-logo.png",
          path: "./views/enfuse-logo.png",
          cid: "enfuse-logo",
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
  "/api/job/approval",
  authenticate,
  // checkPermission("job_approve_email"),
  (req, res) => {
    const { position, department, postedBy, jobId, toEmail, status } = req.body;

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
        to: toEmail,

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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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

emailRouter.put(
  "/api/job/approval",
  authenticate,
  // checkPermission("job_approve_email"),
  (req, res) => {

    console.log('entered put job/approval');

    const { _id, position, department, postedBy, vacancies, experience, jobId, jobLocation, description, toEmail, status } = req.body;

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

        to: toEmail,
        subject: "Status update for the Job Position Requested",
        html: compiledTemplate10.render({
          _id,
          position,
          department,
          postedBy,
          experience,
          vacancies,
          jobLocation,
          description,
          jobId,
          status,
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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


//Interview slot request by HR/Admin to Panelist/HiringManager
emailRouter.post(
  "/api/slot/request",
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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
  "/api/interview-slot-booked",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, candidatePosition, panelistEmail, panelistName, roundName, meetingURL, interviewDt } = req.body;

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
          candidateName, candidateEmail, candidatePosition, roundName, meetingURL, interviewDt, panelistName,
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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
  "/api/interview-scheduled",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, candidatePosition, panelistEmail, panelistName, roundName, meetingURL, interviewDt } = req.body;

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
          meetingURL
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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
  "/api/panelist-feedback",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, postedBy, candidatePosition, panelistName, roundName, interviewDate, feedback, hrEmail, hrName, status } = req.body;

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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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

emailRouter.post(
  "/api/send-rejection-email",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail } = req.body;

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

        subject: `Application Rejected`,
        html: compiledTemplate8.render({
          candidateName
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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

emailRouter.post(
  "/api/send-selection-email",
  // authenticate,
  // checkPermission("request_for_slot"),
  (req, res) => {
    const { candidateName, candidateEmail, postedBy, candidatePosition, panelistName, roundName, interviewDate, feedback, hrEmail, hrName, status } = req.body;

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

        subject: `Update on Interview Feedback ${candidateName} for ${candidatePosition}`,
        html: compiledTemplate7.render({
          candidateName, candidatePosition, roundName, interviewDate, panelistName, feedback, postedBy, status, hrName
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
          {
            filename: "enfuse-logo.png",
            path: "./views/enfuse-logo.png",
            cid: "enfuse-logo",
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
