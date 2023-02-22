const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");




const validateJWT = async(req = request, res=response, next) => {

    const token = req.header("x-token");

    if ( !token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        });
    }

    try {
          
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); //verifica jwt
        //reads if the user has the assigned UID
        const user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: "Token no valido - usuario no existe en BD"
            })
        }

        // VERIFY IF UID ISNT STATE = TRUE
        if (!user.state){
            return res.status(401).json({
                msg: "Token no valido - usuario con estado: false"
            })
        }

        req.user = user; //user validated
  
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: "token no valido"
        });
    }
}

module.exports ={
    validateJWT,
}