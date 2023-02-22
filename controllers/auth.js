const {response, json} = require("express");
const bcryptjs = require("bcryptjs")
const User = require("../models/user");

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

const loginController = async(req, res=response) => {

    const {email, password} = req.body;

    try {
        

        // Verificar si el email existe

        const user = await User.findOne({email});
        if (!user){//Si no existe
            return res.status(400).json({
                msg: "Usuario / contraseña no son correctos - email"
            });
        } 
        
        //Usuario esta activo en la db?
        if (!user.state){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        } 
        //Verificar la contraseña

        const validPswd = bcryptjs.compareSync(password, user.password);
        if (!validPswd){
            return res.status(400).json({
                msg: "Usuario / contraseña no son correctos - password"
            });
        }
        //Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error) //los logs son observados internamente
        return res.status(500).json({
            msg: "Algo ha salido mal"
        })
    }

  
}

const googleSignIn =async(req, res=response) =>{

    const {id_token} = req.body;

    try {
        const {email, name, img} = await googleVerify(id_token)

        let user = await User.findOne({email}); 

        if (!user){
            const data = {
                name,
                email,
                role: "USER_ROLE",
                password: ':P',
                img,
                google:true
            };
            
            user = new User(data);
            await user.save();
        }

        //If user in BD 
        if(!user.state ){
            return res.status(401).json({
                msg: "Hable con el admin, user bloqueado"
            });
        }
        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
           user,
           token
        });


    } catch (error) {
        res.status(400).json({
            msg: "El token de Google no es válido"
        });
    }
}


const renewToken = async(req, res=response) => {

    const { user }= req;

    //generate token
    const token = await generateJWT(user.id);
    

    res.json({
        user,
        token
    })

}


module.exports = {
    loginController,
    googleSignIn,
    renewToken
}