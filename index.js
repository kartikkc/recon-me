require("dotenv").config;
const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const connectToMongo = require("./db");
const User = require("./models/users");
const cors = require("cors");
const app = express();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 5000;
connectToMongo();

//ROUTE-1 : Check the api is up and running
app.get("/", (req, res) => {
    res.json({ "STATUS": "app working fine" });
})

// ROUTE-2: Add a new user to the Database
app.post("/addNewUser", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 5 })
], (req, res) => {
    const { name, email, password } = req.body;
    const user = User({
        name: name,
        email: email,
        password: password
    });
    user.save().then(res.json(req.body.name))
        .catch(error => { console.error(error) });
    // res.json("This endpoint is to add user to the db");
});

app.listen(PORT, () => {
    console.log("[STATUS] The server is Running on PORT: " + PORT);
})