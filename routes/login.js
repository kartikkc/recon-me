require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mailer = require("../mailer");

const JWT_SECRET = "JAYDENisKing";
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
        const user = await User.findOne({ email: email })
        if (user) {
            // comparing passwords
            const { id, email, password, verified } = user;
            const savedPass = password;
            const isPasswordMatch = await bcrypt.compare(receivedPassword, savedPass)
            if (isPasswordMatch) {
                const data = {
                    user: {
                        id: id
                    }
                }
                if (verified) {
                    const authToken = jwt.sign(data, JWT_SECRET);
                    res.json({ "authToken": authToken });
                }
                else {
                    res.json({ "Verify": "Please verify your account to activate it." });
                    console.log(user.verified);
                    // mailer();
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