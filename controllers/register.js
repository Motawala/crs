var mysql = require('mysql');
const date = new Date();
const timestamp = date.toLocaleString() + ":-";
var fs = require('fs')

var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Kp2992002",
    database:"kp45193"
})
  
con.connect(function(err) {
    if (err) throw err;
    const log = timestamp + " MySQL Database Connected!\n"
    fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
        if (err) {
            console.error("Error writing to log file: ", err);
        }
    });
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
                const log = timestamp + " JSON file for " + jsonData["data"]['Property ID'] + " created.\n"
                fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
                    if (err) {
                        console.error("Error writing to log file: ", err);
                    }
                });
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
        const useQuery = "USE properties";
        const insertPropertyID = "INSERT INTO property_ID (propertyID) VALUES (?);"
        const propertyID = jsonData["data"]['Property ID'];
        con.query(sqlQuery, function(err, result){
            if (err){
                console.error("Error Creating the Database, Req made: ", err)
            }else{
                con.query(useQuery, function(err, result){
                    if(err){
                        console.error("Error Using the Database, Req made: ", err)
                    }else{
                        const log = timestamp +" Using Database properties.\n"
                        fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
                            if (err) {
                                console.error("Error writing to log file: ", err);
                            }
                        });
                    }
                })
                con.query(insertPropertyID, [propertyID], function(err, result){
                    if(err){
                        console.error("Error inserting the property id into the database, Req made: ", err)
                    }else{
                        const log = timestamp + " Property ID stored in Properties table Successfully.\n"
                        fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
                            if (err) {
                                console.error("Error writing to log file: ", err);
                            }
                        });
                    }
                })
            }
        })
        return res.status(200).json({
            success: true,
            message: "Database " + dbName + " create successfully!",
            data:response
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error creating database, server"
        })
    }
}


const validatePropertyID = async (req, res) =>{
    try{
        const {propertyID} = req.body
        const useQuery = "USE properties;"
        const sqlQuery = "SELECT * from property_id WHERE propertyID = (?);"
        var response;
        con.query(useQuery, function(err, result){
            if(err){
                console.error("Error in finding the Database: ", err);
            }else{
                const log = timestamp +" Using Properties.\n"
                fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
                    if (err) {
                        console.error("Error writing to log file: ", err);
                    }
                });
            }
        })
        con.query(sqlQuery, [propertyID], function(err, result, fields){
            if(err){
                console.error("Error Finding the property ID in the table")
            }else{
                const log = timestamp +" Found the Database " + propertyID + ".\n"
                response = result
                fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
                    if (err) {
                        console.error("Error writing to log file: ", err);
                    }
                });
                if(result.length >= 1){
                    if(result[0].propertyID == propertyID){
                        return res.status(200).json({
                            success: true,
                            message: propertyID,
                        })
                    }
                }else{
                    return res.status(500).json({
                        success: false,
                        message: "Error finding the Database, server"
                    })
                }
            }
        })
      
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error finding the Database, server"
        })
    }
}





module.exports = {writeJSON, createDB, validatePropertyID, con}