const dbvalidators = require("./db-validators");
const generateJWT = require("./generateJWT");
const googleVerify = require("./google-verify");
const uploadFile = require("./upload-files");





module.exports = {
    ...dbvalidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadFile,
}
