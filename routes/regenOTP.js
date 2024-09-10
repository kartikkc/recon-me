const express = require("express");
const mailer = require("../mailer");
const router = express.Router();
const { OtpGen } = require("./generateOTP");
const User = require("../models/users");

router.post("/", async (req, res) => {
    const { email } = req.body;
    const getID = await User.findOne({ email: email }).select("-password");
    if (getID) {
        if (getID.verified == true) {
            res.json({ status: "You are already verified no need to regenerate OTP" });
        }
        else {
            const userID = getID._id;
            // const response = await OtpGen(userID);
            // res.json(response);
             const response = await OtpGen(userID);
             await mailer(response, getID.fname, getID.email);
             res.status(200).json({Message:"Otp Sent on "+getID.email});
        }
    }
    else {
        res.json({ status: "User Not Found, Otp cannot be generated" })
    }
})

module.exports = router;
