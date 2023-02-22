const { Socket } = require('socket.io');
const { checkJWT } = require("../helpers");
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();



// Connected user
const socketController = async(socket = new Socket(), io) => {
    
    const user = await checkJWT( socket.handshake.headers['x-token']);
    if (!user){
        return socket.disconnect();
    }


    // add connected user
    chatMessages.connUser(user);
    io.emit('active-users', chatMessages.usersArr)

    
    // connect the user to a special room
    
    socket.join(user.id); //global, socket.id, usuario.id

    


    // Clean after user being disconnected
    socket.on('disconnect', () =>{
        chatMessages.logoutUser(user.id); 
        io.emit('active-users', chatMessages.usersArr);
        socket.emit('receive-messages', chatMessages.last10);


    });


    socket.on('send-message', ({uid, msg}) =>{
        if(uid){
           //private msg
           socket.to(uid).emit('private-message',{ from: user.name, msg  });
           
        }else{

            chatMessages.sendMessage(user.id, user.name, msg)
            io.emit('receive-messages', chatMessages.last10);

            
        }
            

    });

}

module.exports = {
    socketController

}