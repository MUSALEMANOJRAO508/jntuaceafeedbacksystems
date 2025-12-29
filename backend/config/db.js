const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/registration");
        console.log("Mongidb connected successfully");
    }catch(error){
        console.log("mongodb error",error);
    }
}

module.exports = connectDB;