const myForm = document.querySelector('form');


// Doesn't work with an arrow fn
  const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8081/api/auth/'
  : 'https://node-rest-production.up.railway.app/api/auth/';

    myForm.addEventListener('submit', ev =>{
      ev.preventDefault();

      const formData = {};

      for(let el of myForm.elements){
        if (el.name.length > 0)
              formData[el.name] = el.value
      }


      fetch(url + 'login', {
        method:'POST',
        body: JSON.stringify(formData),
        headers: {'Content-type': 'application/json'}
      })
      .then(resp => resp.json() )
      .then(( { msg, token} ) => {
        
        if(msg){
          return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
      })
      .catch(err => {
        console.log(err)
      })



    });


function handleCredentialResponse(response) {
  // Google Token: ID_TOKEN
  // console.log('id_token', response.credential);
  const body = { id_token: response.credential };

  fetch(url + 'google', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  })
      .then((resp) => resp.json())
      //of all the data, we only need the token. 
      .then( ( {token} ) => {
            localStorage.setItem('token', token); 
            window.location = 'chat.html';

      })
      .catch(console.warn);
}

const btn = document.getElementById("google_signout");
btn.onclick = () => {
console.log(google.accounts.id)
google.accounts.id.disableAutoSelect()
google.accounts.id.revoke(localStorage.getItem("email"), done => {
  localStorage.clear();
  location.reload();
});


}