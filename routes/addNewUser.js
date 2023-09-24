require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const JWT_SECRET = "JAYDENisKing";
router.post("/", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 5 })
], async (req, res) => {
    // Checking for bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Checking for already existing user
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ error: "Email Already Exists, Please Sign-in" });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const newPass = await bcrypt.hash(password, salt);
            user = await User.create(
                {
                    name: name,
                    email: email,
                    password: newPass,
                    verified: false
                }
            )
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ "status": "Success! User Created! Please Continue to Verify your Account", "authToken": authToken });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Somer Error Occured");
    }
});

module.exports = router;