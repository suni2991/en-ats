const express = require("express");
const emailRouter = new express.Router();
const nodemailer = require("nodemailer");
const Hogan = require('hogan.js')
const fs = require('fs');
//const { dirname } = require("path");

const template = fs.readFileSync('./views/email.hjs', 'utf-8')
const compiledTemplate = Hogan.compile(template);

// send mail
emailRouter.post("/user/register", (req, res) => {
    const { role } = req.body;
    const { confirmPassword } = req.body;
    const { email } = req.body;
    const { fullName } = req.body;

    try {

        const transporter = nodemailer.createTransport({
            
            service: "gmail",
            auth: {
                user: "sunithach2991@gmail.com",
                pass: "irzenkailwllcdtx"
            }
        });

        const mailOptions = {
            from: 'sunithach2991@gmail.com',
            to: email,
            subject: "Enfuse Welcomes You",
            html: compiledTemplate.render({ role, email, fullName, confirmPassword }),
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




module.exports = emailRouter;