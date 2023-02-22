const path = require("path");
const fs = require("fs");
const {response} = require("express");
const cloudinary = require("cloudinary").v2
cloudinary.config(process.env.CLOUDINARY_URL);
const {uploadFile} = require("../helpers");
const {User, Product} = require("../models");


const uploadFiles = async(req, res = response) => {
  try {
    // txt, md
    // const name = await uploadFile(req.files, ["txt", "md"], "textos");
    const name = await uploadFile(req.files, undefined, "imgs");
  
    res.json({ name });
    
  } catch (msg) {
    res.status(400).json({msg});
  }
}


const updateImg = async(req, res = response) => {

  const {userID, collection} = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await User.findById(userID);
      if(!model){
        return res.status(400).json({
          msg:`No existe un user con el id: ${userID}`
        })
      }
      break;
  case "product":
    model = await Product.findById(userID);
    if(!model){
      return res.status(400).json({
        msg:`No existe un user con el id: ${userID}`
      })
    }
    break;
    default:
      return res.status(500).json({ msg: `No validado aun`});
  }


  // Limpiar imagenes previas

  try {

    if(model.img){

      // borrar la img del servidor
      const pathImg = path.join(__dirname, "../uploads", collection, model.img);
      if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg)
      }
    }


  } catch (error) {
    
  }


  const name = await uploadFile(req.files, undefined, collection);
  model.img = name;


  await model.save();



  res.json(model);




}


const showImg = async(req, res= response) => {

  const {userID, collection} = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await User.findById(userID);
      if(!model){
        return res.status(400).json({
          msg:`No existe un user con el id: ${userID}`
        })
      }
      break;
  case "product":
    model = await Product.findById(userID);
    if(!model){
      return res.status(400).json({
        msg:`No existe un user con el id: ${userID}`
      })
    }
    break;
    default:
      return res.status(500).json({ msg: `No validado aun`});
  }


  // Limpiar imagenes previas
    if(model.img){
      // borrar la img del servidor
      const pathImg = path.join(__dirname, "../uploads", collection, model.img);
      if(fs.existsSync(pathImg)){
        return res.sendFile(pathImg)
      }
    }
    const pathNoImg = path.join(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathNoImg);

}

const updateImgCloudinary = async(req, res = response) => {

  const {userID, collection} = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await User.findById(userID);
      if(!model){
        return res.status(400).json({
          msg:`No existe un user con el id: ${userID}`
        });
      }
      break;

  case "product":
    model = await Product.findById(userID);
    if(!model){
      return res.status(400).json({
        msg:`No existe un user con el id: ${userID}`
      })
    }
    break;

    default:
      return res.status(500).json({ msg: `No validado aun`});
  }


  // Limpiar imagenes previas
    if(model.img){
      const nameArr = model.img.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");
      cloudinary.uploader.destroy(public_id)
    }
   
    const {tempFilePath} = req.files.file
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;
    await model.save();
    res.json(model);
}



module.exports = {
    uploadFiles,
    updateImg,
    showImg,
    updateImgCloudinary,
}
