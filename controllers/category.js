const {response} = require("express");
const {Category} = require("../models");



// Obtener categorias - paginado - total - populate


const ObtainCategories = async(req, res=response)=>{

    const { limit = 5, from = 0} = req.query;
    const query = {state:true};

    const [total, categories] = await Promise.all([ 
        Category.countDocuments(query),
        Category.find(query)
            .populate("user", "name")
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({ 
         total,              
         categories
    });


}



// Obtener categoria  - populate{}

const ObtainCategory = async (req, res=response)=>{
    const {userID} = req.params;
    const category = await Category.findById(userID)
                            .populate("user", "name")

    res.json(category)
}



const createCategory = async(req, res = response) =>{ 


    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({name}); 
    if(categoryDB){
        return res.status(400).json({
            msg: `La categoria ${categoryDB.name}, ya existe`
        });
    }


    // Genera la data a guardar

    const data = {
        name,
        user: req.user._id
    }

    const categories = new Category(data);

    // Guardar en la bd

    await categories.save();

    res.status(201).json(categories);
}

// Actualizar categoria

const UpdateCategory = async(req, res=response) => {

    const {userID} = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(userID, data, {new:true});

    res.json(category);
}
// Borrar categoria - estado: False



const deleteCategory = async(req, res=response) => {

    const {userID} = req.params;
    const deletedCategory = await Category.findByIdAndUpdate(userID, {state:false}, {new:true})

    res.json(deletedCategory)

}
module.exports = {
    createCategory,
    ObtainCategories,
    ObtainCategory,
    UpdateCategory,
    deleteCategory
}