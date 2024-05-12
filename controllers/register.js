var mysql = require('mysql');
const bodyParser = require('body-parser');

var fs = require('fs')

var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Kp2992002",
})
  
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected!");
});

const writeJSON = async (req, res) =>{
    try{
        const jsonData = req.body
        const propertyName = jsonData['Property Name'] + '.json'
        fs.writeFile(propertyName, JSON.stringify(jsonData, null, 2), (err) =>{
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('JSON file has been saved.');
            }
        
        })
        return res.status(200).json({
            success: true,
            message: "File Saved Successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Writing to the file, check post req."
        })
    }
}

module.exports = {writeJSON}