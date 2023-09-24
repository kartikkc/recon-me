require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post("/", [
    body("id").exists(),
    body("otp").exists().isLength({ min: 4 })
], (req, res) => {
    res.json({ "status": "Otp checking endpoint!" });
});






module.exports = router;