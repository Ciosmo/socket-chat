const {Router} = require("express");
const {check} = require("express-validator");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares/");
const { createProduct, 
        obtainProducts,
        obtainProduct, 
        updateProduct,
        deleteProduct 
    } = require("../controllers/products");
const { existsCategoryById, existsProductById } = require("../helpers/db-validators");




const router = Router();


/* {{url}}/api/products */


// Obtener todas los productos - publico
router.get("/", obtainProducts);


// Obtener un product  por id - publico
router.get("/:userID",[
    check("userID", "No es un id de mongo valido").isMongoId(),
    check("userID").custom(existsProductById),
    validateFields,
], obtainProduct)

// Crear producto - privado - cualquier persona con un token valido

router.post("/",[
    validateJWT,
    check("name", "El nombre es requerido").not().isEmpty(),
    check("category", "No es un id de mongo").isMongoId(),
    check("category").custom(existsCategoryById),
    validateFields
], createProduct)

// Actualzar - privado - cualquiera con token valido

router.put("/:userID",[
    validateJWT,
/*     check("category", "No es un mongo de id válido").isMongoId(),
 */    check("userID").custom(existsProductById),
    validateFields
], updateProduct)

// Borrar un Product - Admin

router.delete("/:userID",[
    validateJWT,
    isAdminRole,
    check("userID", "No es un id de mongo válido").isMongoId(),
    check("userID").custom(existsProductById),
    validateFields
], deleteProduct)




module.exports = router;
