const express = require("express");
const router = express.router();
const { body, validationResult } = require("express-validator");


router.post("/", [
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
})