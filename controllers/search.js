const { response } = require("express");
const {ObjectId} = require("mongoose").Types;
const {User, Category, Product} = require("../models")

const allowedCollections = [
    "users",
    "category",
    "products",
    "roles"


];

const searchUsers = async(term = "", res=response) => {

    const isMongoID = ObjectId.isValid(term); //true

    if (isMongoID){
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : [] /* Si el usuario existe, se retorna el arr con el user, caso contrario vacio */
        });
    }

    const regex = new RegExp(term, "i");
    const users = await User.find({
        $or:[{name:regex}, { email:regex }],
        $and:[{ state: true }]   
    });

    return res.json({
        results: users
    });
}

const searchCategories = async(term = "", res=response) => {

    const isMongoID = ObjectId.isValid(term); //true

    if (isMongoID){
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : [] /* Si el usuario existe, se retorna el arr con el user, caso contrario vacio */
        });
    }

    const regex = new RegExp(term, "i");
    const categories = await Category.find({name: regex, state:true });

    return res.json({
        results: categories
    });
}

const searchProducts = async(term = "", res=response) => {

    const isMongoID = ObjectId.isValid(term); //true

    if (isMongoID){
        const product = await Product.findById(term)
                             .populate("category", "name");
        return res.json({
            results: (product) ? [product] : [] /* Si el usuario existe, se retorna el arr con el user, caso contrario vacio */
        });
    }

    const regex = new RegExp(term, "i");
    const products = await Product.find({name: regex, state:true })
                           .populate("category", "name");

    return res.json({
        results: products
    });
}



const search = (req, res=response) => {


    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${allowedCollections}`
        });

    }
    switch (collection) {
        case "users":
            searchUsers(term, res);
        break;

        case "category":
            searchCategories(term, res);            
        break;

        case "products":
            searchProducts(term, res);
        break;

        default:
            res.status(500).json({
                msg: "Busqueda no realizada / dev"
            })
        break;
    }


}


module.exports = {
    search,
    searchUsers
}