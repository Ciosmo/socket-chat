

const Role = require("../models/role");
const {User, Category, Product} = require("../models");


const isRoleValid = async(role = "") => {

    const existRole = await Role.findOne({role});
    if(!existRole){
        throw new Error (`El rol: ${role} no esta registrado en la BD`)
    }
}

const isEmailValid = async (email = "") => {


    /* Verificar si el email existe */
    const emailExists = await User.findOne({ email });
    if (emailExists){
        throw new Error (`El email: ${email} ya existe`);
    }


}
const userExistsByID = async (id) => {


    /* Verificar si el email existe */

        const userExists = await User.findById(id);
        if(!userExists){
            throw new Error (`El id: ${id} no es valido`)
        }
        
    



   /*  const userExistsByID = await User.findById(id);
    if (!userExistsByID){
        throw new Error (`El : ${id} no existe`);
    } */


}


// Categoria

existsCategoryById = async (id)=>{
    
    const existsCategory = await Category.findById(id);
    if(!existsCategory){
        throw new Error (`El id: ${id} no es valido`)
    }
    

}
/* Products */

existsProductById = async (id)=>{
    
    const existsProduct = await Product.findById(id);
    if(!existsProduct){
        throw new Error (`El id: ${id} no es valido`)
    }
    

}

/* Validate allowed collections */

const allowedCollections = (collection = "", collections = []) => {

    const included = collections.includes(collection);
    if( !included ){
        throw new Error(`La colección ${collection} no es permitida, ${collections}`);
    }

    return true;

}



module.exports = {
    isRoleValid,
    isEmailValid,
    userExistsByID,
    existsCategoryById,
    existsProductById,
    allowedCollections
}
