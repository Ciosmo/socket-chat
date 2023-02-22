const url = window.location.hostname.includes('localhost')
? 'http://localhost:8081/api/auth/'
: 'https://node-rest-production.up.railway.app/api/auth/';





let user = null;
let socket = null;


// HTML REFERENCES
const txtUid =document.querySelector('#txtUid')
const txtMsg =document.querySelector('#txtMsg')
const ulUsers = document.querySelector('#ulUsers')
const ulMensajes = document.querySelector('#ulMensajes')
const btnExit = document.querySelector('#btnExit')


// validate token from localStorage
const validateJWT = async() => {

    const token = localStorage.getItem('token')|| '';

    if (token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers:{ 'x-token': token }
    });


    const { user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB)
    user = userDB;
    document.title = user.name;
    
    await connSocket();

}

const connSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

     socket.on('connect', ()=>{
        console.log('sockets online')
     });

     socket.on('disconnect', () => {
        console.log('sockets offline')
     });

    socket.on('receive-messages', drawMessages);
    socket.on('active-users', drawUsers);

    socket.on('private-message', (payload) => {
        console.log('Privado: ', payload);
    });
    

    

}

const drawUsers = (users=[]) =>{

    let usersHtml = '';
    users.forEach(({name, uid})=> {
        usersHtml +=`
        <li>
            <p>
                <h5 class='text-success'>${name}</h5>
                 <span class='fs-6 text-muted'>${ uid } </span>
            </p>
        </li>
        `;
    });

    ulUsers.innerHTML = usersHtml;

}


const drawMessages = (messages=[]) =>{

    let messagesHtml = '';
    messages.forEach( ({ name, message }  )=> {
        messagesHtml +=`
        <li>
            <p>
                <span class='text-primary'>${name}: </span>
                 <span'>${ message } </span>
            </p>
        </li>
        `;
    });

    ulMensajes.innerHTML = messagesHtml;

}



// what keycode is used
txtMsg.addEventListener('keyup', ({keyCode}) => {

    // we can validate the no use of special keys and the split for spaces

    const msg = txtMsg.value;
    const uid = txtUid.value;

    if (keyCode !== 13){return;}
    if(msg.length === 0){return;}

    socket.emit('send-message',{ msg, uid});

    txtMsg.value = '';


});


const main = async() =>{

    //validate JWT
    await validateJWT();

}


main();



