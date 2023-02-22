const {Router} = require("express");
const {check} = require("express-validator");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares/");
const { createCategory, 
        ObtainCategories,
        ObtainCategory, 
        UpdateCategory,
        deleteCategory 
    } = require("../controllers/category");
const { existsCategoryById } = require("../helpers/db-validators");




const router = Router();


/* {{url}}/api/category */


// Obtener todas las categorias - publico
router.get("/",ObtainCategories)

// Obtener una categoria por id - publico
router.get("/:userID",[
    check("userID", "No es un id de mongo valido").isMongoId().bail().custom(
        existsCategoryById
    ),
    validateFields,
], ObtainCategory)

// Crear categoria - privado - cualquier persona con un token valido

router.post("/",[
    validateJWT,
    check("name", "El nombre es requerido").not().isEmpty(),
    validateFields
], createCategory)

// Actualzar - privado - cualquiera con token valido

router.put("/:userID",[
    validateJWT,
    check("name", "EL nombre es obligatorio").not().isEmpty(),
    check("userID").custom(existsCategoryById),
    validateFields
], UpdateCategory)

// Borrar una cateogira - Admin

router.delete("/:userID",[
    validateJWT,
    isAdminRole,
    check("userID", "No es un id de mongo válido").isMongoId(),
    check("userID").custom(existsCategoryById),
    validateFields
], deleteCategory)
module.exports = router;
