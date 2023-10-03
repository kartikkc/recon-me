const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL;

const connectToMongo = () => {
    mongoose.connect(mongoURL)
        .then(
            console.log("[STATUS] Connected To The Database")
        ).catch(error => console.error(error));
}
module.exports = connectToMongo;