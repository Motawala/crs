const homebutton = document.getElementById('home-button');
if(homebutton){
    homebutton.addEventListener('click', function(){
        window.location.href = "/"
    })
}

const sendbutton = document.getElementById('send-button');
if(sendbutton){
    sendbutton.addEventListener('click', function(){
        createEmailMessage()
    })
}

const verifybutton = document.getElementById('verify-button');
if(verifybutton){
    verifybutton.addEventListener('click', function(){
        verifyCode()
    })
}


async function verifyCode(){
    const propertyID = document.getElementById('property-id');
    const verificationCode = document.getElementById("code");
    if(verificationCode.value != "" && propertyID.value != ""){
        const data = {
            "Property ID": propertyID.value,
            "Verification Code": verificationCode.value
        }
        const validateCode = await validateVerificationCode(data)
        if(validateCode == true){
            alert("Verification Successful, Reset Password Now.")
            /////Start from Here
            //window.location.href = "/"
        }else{
            alert("Invalid Verification Code.")
        }
    }
}

async function createEmailMessage(){
    const propertyID = document.getElementById('property-id');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    if(propertyID.value != "" && username.value != "" && email.value != ""){
        var checkPropertyID = await validatePropertyID(propertyID.value)
        if(checkPropertyID == true){
            const data = {
                "Property ID": propertyID.value,
                "Username": username.value,
                "Email": email.value
            }
            const validateUserandEmail = await validateUser(data)
            if(validateUserandEmail == true){
                const details = {
                    "Property ID": propertyID.value,
                    "Email": email.value
                }
                const sendCode =  await sendVerificationEmail(details)
                if(sendCode == true){
                    alert(`Verification Code sent to: ${email.value}`)
                }else{
                    console.log("Cannot Send Code")
                }
            }else{
                alert("User Information Invalid")
            }
        }else{
            alert("Invalid Property ID.")
        }
    }else{
        alert("Enter the details")
    }
}

async function validateVerificationCode(verificationData){
    try {
        const response = await fetch("/verifyCode", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ verificationData }),
        });

        const data = await response.json(); // Parse JSON response

        if (response.ok) {
            if (data.success) {
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



async function validateUser(userData) {
    try {
        const response = await fetch("/userData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userData}),
        });
        
        const data = await response.json(); // Parse JSON response

        if (response.ok) {
            if (data.success) {
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


async function sendVerificationEmail(details){
    try {
        const response = await fetch("/sendVerificationEmail", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({details}),
        });
        
        const data = await response.json(); // Parse JSON response

        if (response.ok) {
            if (data.success) {
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