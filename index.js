require("dotenv").config;
const express = require("express");
const connectToMongo = require("./db");

const cors = require("cors");
const app = express();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
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

// ROUTE-4: Verify your account with the OTP sent to the mail
// app.use("/verify", require("./routes/otpVerification"))


app.listen(PORT, () => {
    console.log("[STATUS] The server is Running on PORT: " + PORT)
})