// Importing the necessary Packages
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const expressValidator = require("express-validator");
const fetchuser = require("../middleware/fetchUser");
const JWT_SECRET = process.env.JWT_SECRET;
const { OtpGen, OtpVerify } = require("./generateOTP");
const mailer = require("../mailer");
// Setting the necessary things up
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Getting the email of the user before signing-up to make it unique and for signing-up with google.
// router.post("/", [body("email").isEmail()], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         const { email } = req.body;
//         let user = await User.findOne({email: email});
//         if (user) {
//             return res.status(400).json({ error: "Email Already Exists, Please Sign-in" });
//         }
//         else {
//             user = await User.create({
//                 email: email,
//                 verified: false
//             });
//             const getID = user.id;
//             var otpString = await OtpGen(getID);
//             await mailer(otpString, email, email);
//             // res.json({ Otp: otpString });
//             // res.redirect("")
//         }
//     }
//     catch (error) {
//         console.error(error);
//     }
// })
// Creating the new request handler: ( For creating new user)
router.post("/", [
    // Checking the request for everything necssary
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("fname").isLength({ min: 5 }),
    body("lname").isLength({ min: 3 }),
], async (req, res) => {
    // Checking for bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Checking for already existing user
    try {
        const { fname, lname, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ error: "Email Already Exists, Please Sign-in" });
        }
        // Creating the new User
        else {
            const salt = await bcrypt.genSalt(10);
            const newPass = await bcrypt.hash(password, salt);
            user = await User.create(
                {
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: newPass,
                    verified: false,
                    googleId: null,
                    facebookId: null
                }
            )
            const data = {
                user: {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            const getID = user.id;
            var otpString = await OtpGen(getID);
            await mailer(otpString, fname, email);
            res.json({ "status": "Success! User Created! Please Continue to Verify your Account", "authToken": authToken });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Somer Error Occured");
    }
});

router.post("/verify", body("otp").exists(), fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // getting the OTP from the user in the request and comparing it with OTP stored in the DB
        const getID = req.user.id;
        const user = await User.findById(getID).select("-password");
        const getOTP = req.body.otp;
        const convertOTP = getOTP.toString();
        const OtpReceived = await OtpVerify(getID, convertOTP);
        res.json({ status: OtpReceived })
    }

    catch (error) {
        console.error(error);
        res.status(500).send("Somer Error Occured");
    }
});


module.exports = router;





