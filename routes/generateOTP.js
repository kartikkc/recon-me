const Otp = require("../models/otp");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

async function OtpGen(userId) {

    const salt = await bcrypt.genSalt(10);
    const RandomOTP = Math.floor(1000 + Math.random() * 9000);
    const otpString = RandomOTP.toString();
    const hashedOTP = await bcrypt.hash(otpString, salt);
    const user = await User.findById(userId).select("-password");
    if (user) {
        await Otp.create({ "userId": userId, "otp": hashedOTP });
        console.log(hashedOTP);
        return otpString;
    }

}

async function OtpVerify(userId, otpReceived) {
    const storedOtp = await Otp.findOne({ "userId": userId });
    console.log(userId);
    if (!storedOtp) {
        return { error: "OTP not found" };
    }

    const currentDate = Date.now();

    if (storedOtp.expiry < currentDate) {
        await Otp.findByIdAndDelete(storedOtp._id);
        return { error: "OTP expired. Please generate another OTP" };
    }
    console.log(storedOtp.otp);
    const isVerified = await bcrypt.compare(otpReceived, storedOtp.otp);

    if (isVerified) {
        await User.findByIdAndUpdate(userId, { $set: { verified: true } });
        await Otp.findByIdAndDelete(storedOtp._id);
        return { status: "User Verified" };
    }

    return { error: "Incorrect OTP" };
}

module.exports = { OtpGen, OtpVerify }