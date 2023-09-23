const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/R3C0N-M3";

const connectToMongo = () => {
    mongoose.connect(mongoURL)
        .then(
            console.log("[STATUS] Connected To The Database")
        ).catch(error => console.error(error));
}
module.exports = connectToMongo;