const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const router = express.Router();



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
        const user = User.findOne({ email: email })
        if (user) {
            // comparing passwords
            const access = await bcrypt.compare(password, user.password);
            console.log(access);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured");
    }
})

module.exports = router;