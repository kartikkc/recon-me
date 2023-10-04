const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { OtpVerify } = require("./generateOTP");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", async (req, res) => {
    const googleId = req.header("googleId");
    const { otp } = req.body;
    const getID = await User.findOne({ googleId: googleId }).select("-password");
    if (getID) {
        if (getID.verified == true) {
            res.json({ status: "You are already verified no need to regenerate OTP" });
        }
        else {
            const userID = getID._id;
            // res.json(req.body.otp);
            const response = await OtpVerify(userID, otp);
            data = {
                id: getID._id
            }
            const authToken = await jwt.sign(data, JWT_SECRET);
            res.json(response, { "auth-token": authToken });
        }
    }
    else {
        res.json({ status: "User Not Found, Otp cannot be generated" })
    }
})

module.exports = router;