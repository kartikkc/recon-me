require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");
const User = require("./models/users");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
const { OtpGen } = require("./routes/generateOTP");
const app = express();
app.use(cors());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 5000;
connectToMongo();
//ROUTE-1 : Check the api is up and running
app.get("/", (req, res) => {
    res.json({ "STATUS": "app working fine" })
})

// ROUTE-2: Add a new user to the Database
app.use("/createuser", require("./routes/addNewUser"))

// ROUTE-3: Login using Native Email and Password
app.use("/login", require("./routes/login"))

// ROUTE-4: To regenerate the otp and verfiy the account
app.use("/regenerate", require("./routes/regenOTP"));

// ROUTE-5: for Google OAuth.
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            userId: user.id,
            name: user.username,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/verified",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const { id, displayName, emails } = profile;
            // Check if the user exists in the database by their Google ID
            const googleUser = await User.findOne({ googleId: profile.id });

            if (googleUser) {
                // User exists, return the user object
                return cb(null, googleUser);
            } else {
                // User doesn't exist, create a new user
                const newUser = new User({
                    name: displayName,
                    email: (emails && emails.length > 0) ? emails[0].value : null,
                    verified: false,
                    googleId: id,
                });

                await newUser.save();

                // Return the new user object
                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }
));
app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/verified", passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const userId = req.user._id;
        const Otpgen = await OtpGen(userId);
        res.json({ status: "not verified", "otp": Otpgen });
    }
);

app.use("/verifyOtp", require("./routes/verifyOtp"));

app.listen(PORT, () => {
    console.log("[STATUS] The server is Running on PORT: " + PORT)
})