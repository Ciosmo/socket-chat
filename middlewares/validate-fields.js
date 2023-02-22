const { validationResult } = require("express-validator");


const validateFields = ( req, res, next) => {

    const err = validationResult(req);
    if (!err.isEmpty()){
        return res.status(400).json(err);
    }

    next(); //Si el middleware pasa

}

module.exports= {
    validateFields
}
