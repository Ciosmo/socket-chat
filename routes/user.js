
const { Router } = require("express");
const { check } = require("express-validator");


// const { validateFields } = require("../middlewares/validate-fields");
// const { validateJWT } = require("../middlewares/validate-jwt");
// const { isAdminRole, hasRole } = require("../middlewares/validate-roles");
const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole
} = require("../middlewares")
const { isRoleValid, isEmailValid, userExistsByID } = require("../helpers/db-validators");
const { userGet, 
        userPost, 
        userPatch, 
        userDelete, 
        userPut } = require("../controllers/user");

const router = Router();


router.get('/', userGet);

router.put('/:userID',[ 
    check("userID", "No es un ID valido").isMongoId(),
    check("userID").custom(userExistsByID),
    check("role").custom(isRoleValid),
    validateFields
],userPut);

router.post('/',[
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contaseña es obligatorio, más de 6 letras").isLength({ min: 6 }),
    check("email", "El correo no es valido").isEmail(),
    check("email").custom(isEmailValid),
    // check("role", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),


    check("role").custom(isRoleValid),
validateFields
], userPost);


router.delete('/:userID',[
    validateJWT,
    // isAdminRole,
    hasRole("ADMIN_ROLE", "SALES_ROLE", "RESOURCES_ROLE"),
    check("userID", "No es un id valido").isMongoId(),
    check("userID").custom(userExistsByID),
    validateFields
], userDelete);

router.patch('/', userPatch);

module.exports = router;

