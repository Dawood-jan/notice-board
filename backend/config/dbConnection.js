const mongoose = require("mongoose");


const dbConnect = async function main() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/notice-board-system');
        console.log("Db connected");
    } catch (error) {
        console(error.message);
    }
}

dbConnect();


