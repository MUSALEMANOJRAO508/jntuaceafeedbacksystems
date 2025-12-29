const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://musalemanojraodcme033:Musale%4023005A0508@cluster0.yxdk6nk.mongodb.net/collegeDB?appName=Cluster0
");
        console.log("Mongidb connected successfully");
    }catch(error){
        console.log("mongodb error",error);
    }
}

module.exports = connectDB;
