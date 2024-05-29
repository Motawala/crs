const homebutton = document.getElementById('home-button');
if(homebutton){
    homebutton.addEventListener('click', function(){
        window.location.href = "/"
    })
}

const createButton = document.getElementById('create-button');
if(createButton){
    createButton.addEventListener('click', (event) =>{
        event.preventDefault()
        getAccountInfo()
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    const togglePasswordVisibility = (eyeButtonId, passwordInputId) => {
        const eyeButton = document.getElementById("eye-button");
        const passwordInput = document.getElementById("password");

        eyeButton.addEventListener('mousedown', () => {
            passwordInput.type = 'text';
            eyeButton.src = '/Images/eye-open.png'; // Change to the open eye icon
        });

        eyeButton.addEventListener('mouseup', () => {
            passwordInput.type = 'password';
            eyeButton.src = '/Images/eye-close.png'; // Change back to the closed eye icon
        });

        eyeButton.addEventListener('mouseleave', () => {
            passwordInput.type = 'password';
            eyeButton.src = '/Images/eye-close.png'; // Change back to the closed eye icon
        });
    };

    togglePasswordVisibility('eye-button-new', 'new-password');
    togglePasswordVisibility('eye-button-confirm', 'confirm-new-password');
});

document.addEventListener('DOMContentLoaded', (event) => {
    const togglePasswordVisibility = (eyeButtonId, passwordInputId) => {
        const eyeButton = document.getElementById("eye-button2");
        const passwordInput = document.getElementById("confirm-password");

        eyeButton.addEventListener('mousedown', () => {
            passwordInput.type = 'text';
            eyeButton.src = '/Images/eye-open.png'; // Change to the open eye icon
        });

        eyeButton.addEventListener('mouseup', () => {
            passwordInput.type = 'password';
            eyeButton.src = '/Images/eye-close.png'; // Change back to the closed eye icon
        });

        eyeButton.addEventListener('mouseleave', () => {
            passwordInput.type = 'password';
            eyeButton.src = '/Images/eye-close.png'; // Change back to the closed eye icon
        });
    };

    togglePasswordVisibility('eye-button-new', 'new-password');
    togglePasswordVisibility('eye-button-confirm', 'confirm-new-password');
});


async function getAccountInfo(){
    const propertyID = document.getElementById('property-id');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password')
    const confirmPassword = document.getElementById('confirm-password');
    if(propertyID.value != ""){
        var checkID = await validatePropertyID(propertyID.value)
        if(checkID == true){
            if(firstname.value != "" && lastname.value != "" && username.value != "" && email.value != "" && password.value != "" && confirmPassword.value != "" && (password.value == confirmPassword.value)){
                const data = {
                    "Property ID": propertyID.value,
                    "First Name": firstname.value,
                    "Last Name": lastname.value,
                    "Username": username.value,
                    "Email": email.value,
                    "Password": password.value,
                }
                const createAccount = storeUser(data)
                if(createAccount == true){
                    alert("Account Created Successfully.")
                }else{
                    //alert("Username already exist")
                }
            }else{
                alert('Check User Details.')
            }
        }else{
            alert("Invalid Property ID.")
        }
    }else{
        alert("Enter the Property ID.")
    }
}


async function validatePropertyID(propertyID) {
    try {
        const response = await fetch("/validatePropertyID", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propertyID }),
        });

        const data = await response.json(); // Parse JSON response

        if (response.ok) {
            if (data.success) {
                console.log('Property found'); // Access the data from the response
                return true;
            } else {
                console.error('Error:', data.message);
                return false;
            }
        } else {
            console.error('Bad response from server');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function storeUser(data){
    try{
        const response = await fetch("/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        });

        if(response.ok){
            console.log("User Created Successfully.")
            return true
        }else{
            if(response.status == 409){
                alert("Username Already Exist")
            }
            console.log("Failed to Created the User.")
           
            return false
        }
    }catch(error){
        console.error('Error:', error);
        return false;
    }
}