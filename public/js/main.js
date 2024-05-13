
function redirect_page(url){
  window.location.href = "http://localhost:5000" + url
}


const csrlogo = document.getElementById("crs-logo")
csrlogo.addEventListener('click', function(){
  redirect_page("/")
})

const registerButton = document.getElementById("register")
registerButton.addEventListener('click', function(){
  redirect_page("/register")
})

const signIn = document.getElementById("sign-in")
signIn.addEventListener('click', function(){
  redirect_page("/signIn")
})

const createAccount = document.getElementById('create-account');
createAccount.addEventListener('click', function(){
  redirect_page("/createAccount")
})