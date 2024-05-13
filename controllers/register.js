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
        const propertyName = jsonData["data"]['Property ID'] + '.json'
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

/*
    This function is used to create database in MySQl.
    It uses the property ID to create the Database;
*/
const createDB = async (req, res) =>{
    try{
        const jsonData = req.body
        const dbName =  "CREATE DATABASE " +  jsonData["data"]['Property ID']
        const sqlQuery = dbName;
        con.query(sqlQuery, function(err, result){
            if (err){
                console.error("Error Creating the Database, Req made: ", err)
            }else{
                console.log("Database created " + jsonData["data"]['Property ID']);
            }
        })
        return res.status(200).json({
            success: true,
            message: "Database " + dbName + " create successfully!"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error creating database, server"
        })
    }
}

module.exports = {writeJSON, createDB}