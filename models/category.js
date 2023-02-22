


const {Schema, model} = require("mongoose");


const CategoryScheme = Schema({
    name: {
        type:String,
        require: [true, "El nombre es obligatorio"],
        unique:true
    },
    state:{
        type: Boolean,
        default:true,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
});

CategoryScheme.methods.toJSON = function(){
    const { __v,state, ...data } = this.toObject();

    return data;
}





module.exports = model("Category", CategoryScheme);


