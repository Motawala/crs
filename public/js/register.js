async function getButton(ID){
    const element = document.getElementById(ID)
    if(element){
        return element
    }else{
        console.log(ID + " element undefined")
    }
}

const nextButton = document.getElementById("next-button")
nextButton.addEventListener('click', function(){
    if(checkInputs() != false){
        const roomDetailDiv = document.getElementById('room-details')
        roomDetailDiv.style.display = "flex"
        roomDetailDiv.style.flexDirection = "column"
        const propertyDetailDiv = document.getElementById("property-detail-div")
        propertyDetailDiv.style.display = "none"
    }

})

const previousButton = document.getElementById("previous-button")
previousButton.addEventListener('click', function(){
    const roomDetailDiv = document.getElementById('room-details')
    roomDetailDiv.style.display = "none"
    const propertyDetailDiv = document.getElementById("property-detail-div")
    propertyDetailDiv.style.display = "flex"
    propertyDetailDiv.style.flexDirection = "column"
})

function checkInputs(){
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

    console.log(propertyName)
    if(propertyName == ""){
        alert("Enter the valid Property name.")
        propertyName.style.border = "2px solid red"
        return false
    }else if(propertyID == ''){
        alert("Enter the valid Property ID.")
        return false
    }else if(propertyEmail == ''){
        alert("Enter the valid Property Email.")
        return false
    }else if(propertyAd1 == ''){
        alert("Enter the valid Property's Address Line 1.")
        return false
    }else if(propertyCity == ''){
        alert("Enter the valid Property's City.")
        return false
    }else if(propertyState == ''){
        alert("Enter the valid Property's State.")
        return false
    }else if(propertyZip == ''){
        alert("Enter the valid Property's Zip-Code.")
        return false
    }else{
        return true
    }
}

createInputs(100,0)

const finishButton = document.getElementById("finish-button")
finishButton.addEventListener('click', (event) =>{
    event.preventDefault()
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
            writeData(data)
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
            writeData(data)
        }
    }
})

async function writeData(data) {
    try {
        const response = await fetch("/storePropertyDetails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Removed unnecessary nested object
        });

        if (response.ok) {
            console.log("Data Written to the file");
        } else {
            console.error("Error from front writing data");
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle the error gracefully
    }
}


const nextButton2 = document.getElementById("next-button2")
if(nextButton2){
    nextButton2.addEventListener('click', (event) =>{
        event.preventDefault()
        const roomDetailDiv = document.getElementById('room-details')
        roomDetailDiv.style.display = "none"
        const roomInputDiv = document.getElementById('room-input')
        roomInputDiv.style.display = "block"
    })
}


function createInputs(count, parent){
    const roomInputDiv = document.getElementById('room-input')
    console.log(roomInputDiv)
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
        roomNum.id = "room-num-" + i+1

        roomType.style.position = "relative"
        roomType.style.width = "25%"
        roomType.style.height = "5%"
        roomType.style.backgroundColor = "white"
        roomType.style.borderRadius = "5px"
        roomType.style.margin = "5px"
        roomType.id = "room-type-" + i
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


