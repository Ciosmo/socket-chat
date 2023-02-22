const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");



const userGet =  async(req=request, res = response) => {


    const { limit = 5, from = 0} = req.query;
    const query = {state:true};


// Se espera la resolución de ambas promesas con el await. .all()ejecuta ambas de manera simultanea
    const [total, users] = await Promise.all([ 
        User.count(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({ 
         total,              
         users
    });

}
const userPost = async (req, res = response) => {
    

    const { name, email, password, role } = req.body; //Campos que quiero GRABAR en la creacion de usuario 
    const user = new User( { name, email, password, role  } ); //creacion de la instancia

    //VERIFICAR SI EL EMAIL EXISTE

 

    //ENCRIPTAR LA CONTRASEÑA

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt ); 

    //GUARDAR EN LA BD

    await user.save();

    

    res.json({                
        user
    });

}
const userPut =  async(req, res = response) => {

    const {userID} = req.params;
    const { _id, password, google, email,  ...resto } = req.body;

    //VALIDAR CONTRA BD
    if(password){
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );

    }
    const user = await User.findByIdAndUpdate(userID, resto);

    res.json(user);

}
const userPatch =  (req, res = response) => {
    res.json({                
        msg:"Patch api - controller"
    });

}
const userDelete =  async(req, res = response) => {

    const {userID} = req.params;
    const user = await User.findByIdAndUpdate(userID,{state:false} );
 
    /* Se desactivan por integridad de la BD, siguen existiendo pero no cuentan */
    res.json(user);
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}