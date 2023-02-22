// who is connected and their messages

class Message{
    constructor(uid,name, message){
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}



class ChatMessages {

    constructor(){
        this.messages = [];
        this.users = {};
    }

    get last10 (){
        this.messages  = this.messages.splice(0,10);
        return this.messages;
    }

    get usersArr(){
        // takes the object and transforms it to an array
        return Object.values(this.users); 

    }

    sendMessage( uid, name, message ){
        this.messages.unshift(
            new Message(uid,name,message)
        );
    }

    connUser(users){
        this.users[users.id] = users;
    }


    logoutUser(id){
        delete this.users[id];
    }
}


module.exports = ChatMessages;