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


document.addEventListener('DOMContentLoaded', (event) => {
    const togglePasswordVisibility = (eyeButtonId, passwordInputId) => {
        const eyeButton = document.getElementById("eye-button");
        const passwordInput = document.getElementById("new-password");

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
        const passwordInput = document.getElementById("confirm-new-password");

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


const verifybutton = document.getElementById('verify-button');
if(verifybutton){
    verifybutton.addEventListener('click', async function(){
        const verified = await verifyCode()
        if(verified == true){
            showResetInputs()
        }else{
            alert("User Not Verified.")
        }
        
    })
}

const resetButton = document.getElementById("reset-button")
if(resetButton){
    resetButton.addEventListener('click', async function(){
        const validateResetUpdate = await resetPassword()
        if(validateResetUpdate == true){
            alert("Password Updated Successfully.")
            window.location.href = "/signIn";
        }else{
            alert("Password not updated.")
        }
    })
}

async function resetPassword(){
    const newPassword = document.getElementById('new-password');
    const confirmNewPassword = document.getElementById('confirm-new-password');
    const propertyID = document.getElementById('property-id');
    const username = document.getElementById('username');
    if(newPassword.value != "" && confirmNewPassword.value != "" && newPassword.value == confirmNewPassword.value && propertyID.value != "" && username.value != ""){
        const validPropertyID = await validatePropertyID(propertyID.value)
        if(validPropertyID == true){
            const data = {
                "Property ID": propertyID.value,
                "Username": username.value,
                "New Password": newPassword.value
            }
            const validReset = resetPasswordRequest(data)
            return true
        }else{
            alert("Invalid Property ID")
            return false
        }
    }else{
        alert('Invalid Password Details')
        return false
    }
}



function showResetInputs(){
    const resetForm = document.getElementById('reset-form');
    const inputContainer = document.getElementById("input-container")
    resetForm.style.display = "block"
    inputContainer.style.display = "none"

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
            return true
            /////Start from Here
            //window.location.href = "/"
        }else{
            alert("Invalid Verification Code.")
            return false
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

async function resetPasswordRequest(resetData){
    try {
        const response = await fetch("/resetPassword", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetData }),
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