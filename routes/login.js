require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = express.Router();
const mailer = require("../mailer");
const { OtpGen } = require("./generateOTP");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const JWT_SECRET = process.env.JWT_SECRET;
router.post("/", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 })
], async (req, res) => {
    // Checking for valid Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    // Checking if the User Exists
    try {
        const { email, password } = req.body;
        const receivedPassword = password;
        const receivedEmail = email;
        const user = await User.findOne({ email: email })
        if (user) {
            // comparing passwords
            const { id, fname, lname, email, password, verified } = user;
            const savedPass = password;
            const isPasswordMatch = await bcrypt.compare(receivedPassword, savedPass)
            console.log(verified);
            if (isPasswordMatch) { // Checking if passowrd match
                const data = {
                    user: {
                        id: id,
                        fname: fname,
                        lname: lname
                    }
                }
                if (verified) {
                    const authToken = jwt.sign(data, JWT_SECRET);
                    res.json({ "authToken": authToken });
                }
                else {
                    const selectUser = await User.findById(id).select("-password");
                    if (selectUser) {
                        const fname = selectUser.fname;
                        const generatedOTP = await OtpGen(id);
                        mailer(generatedOTP, fname, email);
                    }
                    res.json({ "Verify": "Please verify your account to activate it." });
                }

            }
            else {
                return res.json({ "Error": "Password Mismatch" });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured");
    }
})

module.exports = router;