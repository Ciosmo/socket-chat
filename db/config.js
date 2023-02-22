const mongoose = require("mongoose");



const dbConn = async() => {
    try {
        
        await mongoose.connect(process.env.MONGODB_CNN, {    
        });
        console.log("BD ONLINE");


    } catch (error) {
        console.log(error)
        throw new Error("Err al iniciar DB");
    }
}

module.exports = {
    dbConn,
}

