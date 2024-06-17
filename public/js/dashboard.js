let userDetails
await fetch('getUsername')
    .then(response => response.json())
    .then(users => userDetails = users)

const roomData =  userDetails['roomData'];
const propertyNameElement = document.getElementById('property-name');
const propertyIdValueElement = document.getElementById('property-id');
const user_name = document.getElementById('user-name')
const totalRooms = userDetails['totalRooms'];
const propertyData = userDetails['propertyData'];
const totalRoomType = propertyData['Number of Room Types']
// Assign text content using JavaScript
propertyNameElement.textContent = userDetails['propertyName'] + ','; // Assign the property name
propertyIdValueElement.textContent = "Property ID: " + userDetails['propertyid']; // Assign the property ID
user_name.textContent = getGreeting() + ", " + userDetails['name'];

const logoutButton = document.getElementById('logout-button')
if(logoutButton){
    logoutButton.addEventListener('click', () => {
        console.log("Here")
        logoutUser()
    });
}

populateDivs(propertyData, roomData)
function populateDivs(propertyData, roomDetails){
    const listOfRoomNo = Object.keys(roomDetails);
    const listOfRoomType = Object.values(roomDetails);
    if(propertyData["Number of Rooms"] == listOfRoomNo.length){
        for(let i=0; i < propertyData["Number of Rooms"]; i++){
            const roomDiv = createRoomDivs(listOfRoomNo[i], listOfRoomType[i])
        }
    }
}

const dashboardButton = document.getElementById('dashboard-button');
if(dashboardButton){
    dashboardButton.addEventListener('click', () => {
        window.location.href = "/dashboard"
    });
}



function createRoomDivs(roomNumber, roomType){
    const roomContainer = document.getElementById('room-container')
    const roomDiv = document.createElement('div');
    roomDiv.style.backgroundColor = "beige";
    roomDiv.style.position = "relative";
    roomDiv.style.height = "12%"
    roomDiv.style.width = "8%"
    roomDiv.style.display = "flex"
    roomDiv.style.flexDirection = "row"
    roomDiv.style.margin = "3px"
    roomDiv.style.float = "left"
    roomDiv.style.border = "grey groove 2px"
    roomDiv.style.borderRadius = "5px"
    roomDiv.style.color = 'grey';
    roomDiv.id = "room" + roomNumber

    roomDiv.addEventListener('mouseover', () => {
        roomDiv.style.backgroundColor = 'yellow'; // Change color on hover
        roomDiv.style.color = 'black'; // Change text color on hover
    });

    roomDiv.addEventListener('mouseout', () => {
        roomDiv.style.backgroundColor = "beige"; // Revert to original color
        roomDiv.style.color = 'grey'; // Revert to original text color
    });
    const roomNumberTag = createRoomNumberTag(roomDiv, roomNumber, roomType)
    
    roomContainer.appendChild(roomDiv)
    return roomDiv
}

function createRoomNumberTag(room, roomNumber, roomType){
    const p = document.createElement('p');
    p.textContent = roomNumber
    p.style.fontSize = "20px"
    p.style.fontWeight = "bold"
    p.style.margin = "0"
    p.style.padding = "5px"
    p.style.color = "brown"

    const p2 = document.createElement('p');
    p2.textContent = roomType
    p2.style.fontSize = "20px"
    p2.style.margin = "0"
    p2.style.padding = "5px"
    room.append(p)
    room.append(p2)
    return [p,p2]
}

function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
        return "Good Morning";
    } else if (hours < 18) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}

async function logoutUser(){
    try{
        const response = await fetch("/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            window.location.href = "/signIn"
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