require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
const PORT = 5000;
connectToMongo();
//ROUTE-1 : Check the api is up and running
app.get("/", (req, res) => {
    res.json({ "STATUS": "app working fine" })
})

// ROUTE-2: Add a new user to the Database
app.use("/createuser", require(__dirname + "./routes/addNewUser"))

// ROUTE-3: Login using Native Email and Password
app.use("/login", require(__dirname + "./routes/login"))

// ROUTE-4: To regenerate the otp and verfiy the account
app.use("/regenerate", require(__dirname + "./routes/regenOTP"));

// ROUTE-5: for Google OAuth.
app.use("/googleLogin", require(__dirname + "./routes/google"));

// ROUTE-6 : Facebook Oauth login
app.use("/facebookLogin", require(__dirname + "./routes/facebook"));

//ROUTE-7 : Verify OTP 
app.use("/verifyOtp", require(__dirname + "./routes/verifyOtp"));

app.listen(PORT, () => {
    console.log("[STATUS] The server is Running on PORT: " + PORT)
})