const signin = document.getElementById('signin-button');
if(signin){
    signin.addEventListener('click', (event) =>{
        event.preventDefault()
        login()
    })
}


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