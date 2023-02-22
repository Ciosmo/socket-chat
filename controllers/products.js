const {response} = require("express");
const {Product} = require("../models");


const obtainProducts = async(req, res=response)=>{

    const { limit = 5, from = 0} = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([ 
        Product.countDocuments(query),
        Product.find(query)
            .populate("user", "name")
            .populate("category", "name")
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({ 
         total,              
         products
    });


}

const obtainProduct = async(req, res=response )=> {

    const {userID} = req.params;
    const product = await Product.findById(userID)
                        .populate("user", "name")
                        .populate("category", "name");
    res.json(product);
}


const createProduct = async(req, res = response) => {

    const {state, user, ...body } = req.body;

    const productDB = await Product.findOne({name:body.name})

    if (productDB){
        return res.status(400).json({
            msg: `El producto ${productDB.name}, ya existe`
        })
    }


    // Generar data a guardar
    const data = {
        ...body,
        name:body.name.toUpperCase(),
        user: req.user._id,
        
    }

    const product = new Product(data);


    // Guardar en la db
    await product.save();
    res.status(201).json(product);


}


const updateProduct = async(req, res=response) => {

    const {userID} = req.params;
    const {state, user, ...data} = req.body;

    if(data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;
    
    const product = await Product.findByIdAndUpdate(userID, data, { new: true });
    
    res.json(product);
}


const deleteProduct = async (req, res=response) => {

    const { userID } = req.params;

    const deletedProduct = await Product.findByIdAndUpdate(userID, { state:false }, { new: true });

    res.json(deletedProduct);
}

module.exports = {
    createProduct,
    obtainProducts,
    obtainProduct,
    updateProduct,
    deleteProduct


}