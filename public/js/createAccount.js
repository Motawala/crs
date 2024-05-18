const createButton = document.getElementById('create-button');
if(createButton){
    createButton.addEventListener('click', (event) =>{
        event.preventDefault()
        getAccountInfo()
    })
}


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
                console.log(propertyID, username.value, email.value, password.value, confirmPassword.value)
                const data = {
                    "Property ID": propertyID.value,
                    "First Name": firstname.value,
                    "Last Name": lastname.value,
                    "Username": username.value,
                    "Email": email.value,
                    "Password": password.value,
                }
                const createAccount = storeUser(data)
                if(storeUser){
                    alert("Account Created Successfully.")
                }else{
                    alert("Failed to Create the Account.")
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
            console.log("Failed to Created the User.")
            return false
        }
    }catch(error){
        console.error('Error:', error);
        return false;
    }
}