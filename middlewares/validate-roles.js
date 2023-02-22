const { response } = require("express");
const role = require("../models/role");

const isAdminRole = (req = response, res=response, next) => {

    if(!req.user){
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token primero"
        });
    }

    const {role, name} = req.user; 
    if (role !== "ADMIN_ROLE"){
        return res.status(401).json({
            msg: `${name} no es admin - No puede realizar esta acción`
        });
    }


    next();

}

const hasRole = ( ...roles) => {

    return (req, res=response, next) => {
        if(!req.user){
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar el token primero"
            });
        }

    if(!roles.includes(req.user.role)){
        return res.status(401).json({
            msg: `El servicio requiere uno de estos roles: ${roles}`
        });
    }

    next();
    }
}


module.exports = {
    isAdminRole,
    hasRole,
}