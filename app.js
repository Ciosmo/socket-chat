require("dotenv").config()
const Server = require("./models/server");

const sv = new Server();


sv.listen();