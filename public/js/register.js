const homebutton = document.getElementById('home-button');
if(homebutton){
    homebutton.addEventListener('click', function(){
        window.location.href = "/"
    })
}

//This is an event handler for next button in Property detail div.
const nextButton = document.getElementById("next-button")
nextButton.addEventListener('click', function(){
    if(validatePropertyDetails() != false){
        const roomDetailDiv = document.getElementById('room-details')
        roomDetailDiv.style.display = "flex"
        roomDetailDiv.style.flexDirection = "column"
        const propertyDetailDiv = document.getElementById("property-detail-div")
        propertyDetailDiv.style.display = "none"
    }

})


//This is an event handler for the next button on Room Detail div
const nextButton2 = document.getElementById("next-button2")
if(nextButton2){
    nextButton2.addEventListener('click', (event) =>{
        event.preventDefault()
        const roomDetailDiv = document.getElementById('room-details')
        roomDetailDiv.style.display = "none"
        const roomInputDiv = document.getElementById('room-input')
        roomInputDiv.style.display = "block"

        const numOfRooms = document.getElementById("no-of-rooms").value
        const roomType = document.getElementById('room-types').value
        if(numOfRooms == ""){
            alert("Enter the total number of rooms")
        }
        if(roomType == ""){
            alert("Enter the number of Room Types")
        }
        if(numOfRooms != "" && roomType != "" && parseInt(numOfRooms) && parseInt(roomType)){
            createInputs(numOfRooms, roomType)
        }else{
            alert("Invalid Entries.")
        }
    })
}

//This is an event handler for previous button
const previousButton = document.getElementById("previous-button")
previousButton.addEventListener('click', function(){
    const roomDetailDiv = document.getElementById('room-details')
    roomDetailDiv.style.display = "none"
    const propertyDetailDiv = document.getElementById("property-detail-div")
    propertyDetailDiv.style.display = "flex"
    propertyDetailDiv.style.flexDirection = "column"
})


//This is an event lister for dynamically created finish button
const roomInputDiv = document.getElementById("room-input")
if(roomInputDiv){
    roomInputDiv.addEventListener('click', (event) =>{
        event.preventDefault()
        let finishButtonID
        if(event.target && event.target.nodeName === 'BUTTON'){
            finishButtonID = event.target.id
        }
        if(finishButtonID == 'finish-button'){
            const propertyName = document.getElementById("property-name").value
            const propertyID = document.getElementById("property-ID").value
            const propertyEmail = document.getElementById("property-email").value
            const propertyAd1 = document.getElementById("property-ad1").value
            const propertyAd2 = document.getElementById("property-ad2").value
            const propertyCity = document.getElementById("property-city").value
            const propertyState = document.getElementById("property-state").value
            const propertyZip = document.getElementById("property-zip").value
            const rooms = document.getElementById("no-of-rooms").value
            const roomTypes = document.getElementById("room-types").value
            var data;
            const [roomNumList, roomTypeList] = getRoomDetails();
            let roomData;
            if(roomNumList && roomTypeList){
                roomData = roomDataToJSON(roomNumList, roomTypeList)
            }
            if(propertyName && propertyID && propertyEmail && propertyAd1 && propertyCity && propertyState && propertyZip && rooms && roomTypes){
                data = {
                    "Property Name": propertyName,
                    "Property ID": propertyID,
                    "Property Email": propertyEmail,
                    "Property Address Line 1": propertyAd1,
                    "Property City": propertyCity,
                    "Property State": propertyState,
                    "Property Zip-Code": propertyZip,
                    "Number of Rooms": rooms,
                    "Number of Room Types": roomTypes
                }
                if(data){
                    writeData(data, roomData)
                }
            }
            if(propertyName && propertyID && propertyEmail && propertyAd1 && propertyAd2 && propertyCity && propertyState && propertyZip && rooms && roomTypes){
                data = {
                    "Property Name": propertyName,
                    "Property ID": propertyID,
                    "Property Email": propertyEmail,
                    "Property Address Line 1": propertyAd1,
                    "Property Address Line 2": propertyAd2,
                    "Property City": propertyCity,
                    "Property State": propertyState,
                    "Property Zip-Code": propertyZip,
                    "Number of Rooms": rooms,
                    "Number of Room Types": roomTypes
                }
                if(data){
                    writeData(data, roomData)
                }
            }
        }
    })
}


//This function is used to convert the room number and room type data to JSON.
function roomDataToJSON(room, roomType){
    let data = {};
    var index = 0;
    if(room.length == roomType.length){
        room.forEach(rm =>{
            data[rm] = roomType[index]
            index = index + 1
        })
    }
    return data;
}

//This function is used to retrive the room detail data.
function getRoomDetails(){
    const roomInputDiv = document.getElementById("room-input");
    const inputsInRoomInputDiv = roomInputDiv.querySelectorAll("input");
    var roomNumID = [];
    var roomTypeID = [];
    var roomEl = []
    const pattern = /^room-num-\d+$/;
   
    inputsInRoomInputDiv.forEach(el =>{
        if(pattern.test(el.id)){
            roomEl.push(el)
        }
    })
    validateRoomDetailsInput(roomEl)
    inputsInRoomInputDiv.forEach(el =>{
        if(pattern.test(el.id)){
            roomNumID.push(el.value)
        }else{
            if(!parseInt(el.value)){
                roomTypeID.push(el.value)
            }else{
                alert("Invalid Room Type " + el.value)
                return;
            }
            
        }
    })
    
    return [roomNumID, roomTypeID];
}


//This function is used to validate the room details input (room number and room type)
function validateRoomDetailsInput(inputs) {
    const valuesSet = new Set(); // Create a set to store unique values
    
    // Loop through each input element
    inputs.forEach(input => {
        const value = input.value.trim(); // Get the trimmed value of the input
        let indicator;
        // Check if the value is already present in the set
        if(value == "" || !parseInt(value)){
            alert("Invalid Room Number " + input.value)
            return;
        }
        if (valuesSet.has(value)) {
            // If value is already present, mark the input as invalid
            alert("Duplicate Room Number " + input.value)
            return;
        } else {
            // If value is not present, add it to the set
            valuesSet.add(value);
            // If input was previously marked as invalid, remove the invalid class
            input.classList.remove('invalid');
        }
    });
}

//This function is used to validate the input values for the property details
function validatePropertyDetails(){
    const propertyName = document.getElementById("property-name")
    const propertyID = document.getElementById("property-ID")
    const propertyEmail = document.getElementById("property-email")
    const propertyAd1 = document.getElementById("property-ad1")
    const propertyAd2 = document.getElementById("property-ad2")
    const propertyCity = document.getElementById("property-city")
    const propertyState = document.getElementById("property-state")
    const propertyZip = document.getElementById("property-zip")
    const rooms = document.getElementById("no-of-rooms")
    const roomTypes = document.getElementById("room-types")
    let validator = true;
    if(propertyName.value == ""){
        alert("Enter the valid Property name.")
        validator = false
    }
    if(propertyID.value == ''){
        alert("Enter the valid Property ID.")
        validator =  false
    }
    if(propertyEmail.value == ''){
        alert("Enter the valid Property Email.")
        validator =  false
    }
    if(propertyAd1.value == ''){
        alert("Enter the valid Property's Address Line 1.")
        validator =  false
    }
    if(propertyCity.value == ''){
        alert("Enter the valid Property's City.")
        validator =  false
    }
    if(propertyState.value == ''){
        alert("Enter the valid Property's State.")
        validator = false
    }
    if(propertyZip.value == '' || !parseInt(propertyZip.value)){
        alert("Enter the valid Property's Zip-Code.")
        validator =  false
    }
    return validator
}



function validateEmail(email) {
    // Regular expression pattern for validating email addresses
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}


//This function is used to create input fields for room number and room type
async function createInputs(count, parent){
    const roomInputDiv = document.getElementById('room-input')
    for(let i = 0; i < count; i++){
        var roomNum = document.createElement('input')
        var roomType = document.createElement('input')
        roomNum.style.position = "relative"
        roomNum.style.width = "25%"
        roomNum.style.height = "5%"
        roomNum.style.backgroundColor = "white"
        roomNum.style.borderRadius = "5px"
        roomNum.style.margin = "5px"
        roomNum.style.fontFamily = "Trebuchet MS, sans-serif;"
        roomNum.style.fontSize = "15px"
        roomNum.placeholder = "Room Number " + (i+1) + "#"
        roomNum.id = "room-num-" + (i+1)

        roomType.style.position = "relative"
        roomType.style.width = "25%"
        roomType.style.height = "5%"
        roomType.style.backgroundColor = "white"
        roomType.style.borderRadius = "5px"
        roomType.style.margin = "5px"
        roomType.id = "room-type-" + (i+1)
        roomType.placeholder = "Room Type"

        
        roomInputDiv.appendChild(roomNum)
        roomInputDiv.appendChild(roomType)
        var lineBreak = document.createElement('br');
        roomInputDiv.appendChild(lineBreak);
    }

    const finishButton = document.createElement('button')
    finishButton.id = "finish-button"
    finishButton.textContent = "Finish"
    roomInputDiv.appendChild(finishButton);
}


//POST request to write data to a JSON file
async function writeData(data, roomData) {
    try {
        const response = await fetch("/storePropertyDetails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data, roomData}),
        });

        if (response.ok) {
            console.log("Data Written to the file");
            createDatabase(data)
        } else {
            console.error("Error from front writing data");
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle the error gracefully
    }
}


//POST request to create the database
async function createDatabase(data){
    const propertyID = data['Property ID'];
    try{
        const response = await fetch("/createDB", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        })
        if (response.ok) {
            console.log("Database for " + data["Property Name"] + " " + data["Property ID"] + " created successfully!");
        } else {
            console.error("Error Creating Database");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}




