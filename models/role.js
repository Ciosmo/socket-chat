/* NAME OF THE FILE HAS THE SAME NAME AS THE COLLETION IN MONGO COMPASS WITHOUT IT BEING PLURAL, HERE IT'S SINGULAR*/


const {Schema, model} = require("mongoose");


const RoleSchema = Schema({
    role: {
        type:String,
        require: [true, "El rol es obligatorio"]
    }
});






module.exports = model("Role", RoleSchema);


