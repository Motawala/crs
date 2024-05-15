const createButton = document.getElementById('create-button');
if(createButton){
    createButton.addEventListener('click', (event) =>{
        event.preventDefault()
        getAccountInfo()
    })
}


function getAccountInfo(){
    const propertyID = document.getElementById('property-id');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password')
    const confirmPassword = document.getElementById('confirm-password');
    if(propertyID.value != ""){
        var checkID = validatePropertyID(propertyID.value)
        if(checkID == true){
            if(username.value != "" && email.value != "" && password.value != "" && confirmPassword.value != "" && (password.value == confirmPassword.valu)){
                console.log(propertyID, username.value, email.value, password.value, confirmPassword.value)
            }
        }else{
            alert("Invalid Property ID.")
        }
    }else{
        alert("Enter the Property ID.")
    }
}


async function validatePropertyID(propertyID){
   
    const response = await fetch("/validatePropertyID", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({propertyID}),
    })
    console.log(response)
    if(response.ok){
        console.log("Response Successful.")
        return true
    }else{
        console.log("Bad Response.")
        return false
    }
}