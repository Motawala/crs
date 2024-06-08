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
        newReservationDiv.appendChild(closeIcon)
        roomContainer.appendChild(newReservationDiv)
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