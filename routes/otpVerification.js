require("dotenv").config();
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const OTP = require("../models/otp");
const User = require("../models/users");
const users = require("../models/users");

router.post("/", [
    body("id").exists(),
    body("otp").exists().isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create an random otp and save it to DB
        const RandomOTP = Math.floor(1000 + Math.random() * 9000);
        console.log(RandomOTP);
        const savingOTP = {
            
        }
    }
    catch (error) {

    }
    res.json({ "status": "Otp checking endpoint!" });
});






module.exports = router;