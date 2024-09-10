const mongoose = require("mongoose");


const dbConnect = async function main() {

    try {
        await mongoose.connect(process.env.MnONGO_URI);
        console.log("Db connected");
    } catch (error) {
        console(error.message);
    }
}

dbConnect();


