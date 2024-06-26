const homebutton = document.getElementById('home-button');
if(homebutton){
    homebutton.addEventListener('click', function(){
        window.location.href = "/"
    })
}



const signin = document.getElementById('signin-button');
if(signin){
    signin.addEventListener('click', (event) =>{
        event.preventDefault()
        login()
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


async function login(){
    const propertyID = document.getElementById('property-id');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if(propertyID.value != ""){
        var checkID = await validatePropertyID(propertyID.value)
        if(checkID == true){
            if(username.value != "" && password.value != ""){
                const data = {
                    "Property ID": propertyID.value,
                    "Username": username.value,
                    "Password": password.value,
                }
                var validUser = await validateUser(data)
                if(validUser == true){
                    //Authenticate user
                    window.location.href = "/dashboard"
                }else{
                    alert("Invalid Username or Password")
                }
            }else{
                alert("Empty username or password field.")
            }
        }else{
            alert("Invalid Property ID.")
        }
    }else{
        alert("Enter the Property ID.")
    }
}

let usr;
async function validateUser(data){
    try {
        const response = await fetch("/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        const responsedata = await response.json(); // Parse JSON response
        usr = (responsedata)
        console.log(usr)
        if (response.ok) {
            console.log('Valid User'); // Access the data from the response
            return true;
        } else {
            console.error('Bad response from server');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
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