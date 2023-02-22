const {Router} = require("express");
const {check} = require("express-validator");
const { validateFields, validateFile } = require("../middlewares/");

const { uploadFiles, updateImg, showImg, updateImgCloudinary } = require("../controllers/uploads");
const {allowedCollections} = require("../helpers");



const router = Router();


router.post( "/",validateFile, uploadFiles );

router.put("/:collection/:userID", [
    validateFile,
    check("userID", "El id debe de ser de mongo").isMongoId(),
    check("collection").custom( c => allowedCollections ( c, ["user", "product"] )),
    validateFields
], updateImgCloudinary)

//,updateImg)


router.get("/:collection/:userID", [
    check("userID", "El id debe de ser de mongo").isMongoId(),
    check("collection").custom( c => allowedCollections ( c, ["user", "product"] )),
], showImg)

module.exports = router;