const {Router} = require("express");
const {check} = require("express-validator");

const { validateFields, validateJWT } = require("../middlewares");
const { loginController, googleSignIn, renewToken } = require("../controllers/auth");



const router = Router();

router.post("/login", [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields
],loginController);
router.post("/google", [
    check("id_token", "Token de google necesasrio").not().isEmpty(),
    validateFields
],googleSignIn);

router.get('/', validateJWT, renewToken)



module.exports = router;