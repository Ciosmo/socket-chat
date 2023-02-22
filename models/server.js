const express = require('express')
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConn } = require('../db/config');
const { socketController } = require('../sockets/socketController');


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)

        this.paths = {
            auth: "/api/auth",
            search: "/api/search",
            category: "/api/category",
            users: "/api/users",
            products: "/api/products",
            uploads: "/api/uploads",
        }
       
        //CONN A DB
        this.connDB();

        //Middlewares
        this.middlewares();

        //Rutas de la app

        
        // Ruta de mi app
        this.routes();

        //Sockets

        this.sockets();

    }
    async connDB (){
        
        await dbConn();
    }
    middlewares(){

        //CORS
        this.app.use(cors() );

        // Parsing y reading del body

        this.app.use( express.json() );

        //Directorio publico
        this.app.use(express.static("public") )

        // File upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));

    }

    routes(){
        
        this.app.use(this.paths.auth,     require("../routes/auth"));
        this.app.use(this.paths.search,   require("../routes/search"));
        this.app.use(this.paths.users,    require("../routes/user"));
        this.app.use(this.paths.category, require("../routes/category"));
        this.app.use(this.paths.products, require("../routes/products"));
        this.app.use(this.paths.uploads,  require("../routes/uploads"));
        
    }
    sockets(){

        this.io.on('connection', ( socket ) =>socketController(socket, this.io))

    }
    listen(){        
        this.server.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port );
        });
    }
}

module.exports = Server;
    
    