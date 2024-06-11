const newReservationButton = document.getElementById("newReservation-button")
if(newReservationButton){
    newReservationButton.addEventListener('click', () => {
        createNewReservationDiv()
    });
}


function createNewReservationDiv(){
    const newReservationDivExist = document.getElementById('newReservation-div')
    if(!newReservationDivExist){
        const newReservationDiv = document.createElement("div");
        const roomContainer = document.getElementById('room-container')
        newReservationDiv.style.position = 'relative';
        newReservationDiv.style.height = "90%";
        newReservationDiv.style.width = "50%";
        newReservationDiv.style.margin = 'auto';
        newReservationDiv.style.backgroundColor = "rgb(201, 201, 201)";
        newReservationDiv.style.alignSelf = "center";
        newReservationDiv.style.marginTop = "30px"
        newReservationDiv.id = "newReservation-div"
        
        const closeIcon = createCloseIcon()
        closeIcon.addEventListener('mosueover', () => {
            console.log("Here")
            closeIcon.style.color = "lightcoral";
        });
        closeIcon.addEventListener('mouseout', () => {
            closeIcon.style.color = "red";
        });
        closeIcon.addEventListener('click', () => {
            removeNewReservationDiv()
        });
        
        roomContainer.appendChild(newReservationDiv)
        createInputs()
        newReservationDiv.appendChild(closeIcon)
    }else{
        console.log("New Reservation Div already displayed")
    }
}

function createCloseIcon(){
    const closeIcon = document.createElement('i')
    closeIcon.classList.add('fa', 'fa-close');
    closeIcon.style.fontSize = "36px";
    closeIcon.style.color = "red";
    closeIcon.style.position = 'absolute'; // Position the icon absolutely
    closeIcon.style.top = '10px'; // Adjust as needed
    closeIcon.style.right = '10px'; // Adjust as needed
    closeIcon.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
    closeIcon.id = 'newReservation-close-icon'
    return closeIcon;
}



function removeNewReservationDiv(){
    const newReservationDiv = document.getElementById('newReservation-div')
    const roomContainer = document.getElementById('room-container')
    roomContainer.removeChild(newReservationDiv);
}

function createInputs(){
    const newReservationDiv = document.getElementById('newReservation-div');
    const inputsDiv = document.createElement("div");
    inputsDiv.style.position = "relative"
    inputsDiv.style.width = "90%"
    inputsDiv.style.height = "90%"
    inputsDiv.style.alignSelf = "center"
    inputsDiv.style.alignItems = "left"
    inputsDiv.style.alignContent = "center"
    inputsDiv.style.justifyContent = "center"
    inputsDiv.style.display = "flex"
    inputsDiv.style.flexDirection = "row"
    inputsDiv.id = "newReservation-input-div"
    inputsDiv.style.padding = "10px"
    inputsDiv.style.margin = "5px"
    inputsDiv.style.flexWrap = "wrap"
    newReservationDiv.appendChild(inputsDiv)


    let input_list = ["firstname", "middlename", "lastname", "Phone Number"]
    input_list.forEach(input =>{
        createInputFields(input)
    })

    createAddressInput()
}

function createInputFields(name){
    const field = document.createElement('input')
    const inputsDiv = document.getElementById("newReservation-input-div")
    field.style.width = "28%"
    field.style.height = "5%"
    field.placeholder = name.toUpperCase() + "*"
    field.style.border = "2px groove black"
    field.style.backgroundColor = "whitesmoke"
    field.style.color = "grey"
    field.id = name + "-input"
    field.style.margin = "5px"

    inputsDiv.appendChild(field)
}

function createAddressInput(){
    const inputsDiv = document.getElementById("newReservation-input-div")
    const addressLine1 = document.createElement("input")
    addressLine1.id = "address-line-1"
    addressLine1.style.width = "90%"
    addressLine1.style.height = "5%"
    addressLine1.placeholder =  "ADDRESS LINE 1*"
    addressLine1.style.border = "2px groove black"
    addressLine1.style.backgroundColor = "whitesmoke"
    addressLine1.style.color = "grey"
    addressLine1.id =  "address-line-1-input"
    addressLine1.style.margin = "5px"

    const addressLine2 = document.createElement("input")
    addressLine2.id = "address-line-2"
    addressLine2.style.width = "90%"
    addressLine2.style.height = "5%"
    addressLine2.placeholder =  "ADDRESS LINE 2"
    addressLine2.style.border = "2px groove black"
    addressLine2.style.backgroundColor = "whitesmoke"
    addressLine2.style.color = "grey"
    addressLine2.id =  "address-line-2-input"
    addressLine2.style.margin = "5px"

    const city = document.createElement("input")
    city.id = "city-input"
    city.style.width = "28%"
    city.style.height = "5%"
    city.placeholder =  "CITY*"
    city.style.border = "2px groove black"
    city.style.backgroundColor = "whitesmoke"
    city.style.color = "grey"
    city.style.margin = "5px"

    const state = document.createElement("input")
    state.id = "state-input"
    state.style.width = "28%"
    state.style.height = "5%"
    state.placeholder =  "STATE*"
    state.style.border = "2px groove black"
    state.style.backgroundColor = "whitesmoke"
    state.style.color = "grey"
    state.style.margin = "5px"

    const zipcode = document.createElement("input")
    zipcode.id = "zipcode-input"
    zipcode.style.width = "28%"
    zipcode.style.height = "5%"
    zipcode.placeholder =  "ZIP-CODE*"
    zipcode.style.border = "2px groove black"
    zipcode.style.backgroundColor = "whitesmoke"
    zipcode.style.color = "grey"
    zipcode.style.margin = "5px"


    inputsDiv.appendChild(addressLine1)
    inputsDiv.appendChild(addressLine2)
    inputsDiv.appendChild(city)
    inputsDiv.appendChild(state)
    inputsDiv.appendChild(zipcode)
}