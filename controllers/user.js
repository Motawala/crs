var mysql = require('mysql');
const bodyParser = require('body-parser');
const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
var fs = require('fs')
const {con} = require("../controllers/register")

const createUser = async (req, res) => {
    try {
        const {data} = req.body;
        const insertQuery = "INSERT INTO users (propertyID, firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?, ?)";
        const useQuery = `USE ${data["Property ID"]}`;
        
        con.query(useQuery, (err) => {
            if (err) {
                console.error("Error Using the Database, Req made: ", err);
                const message = ` Error querying use database ${data['Property ID']}.\n`;
                log(message);
                return res.status(500).json({
                    success: false,
                    message: "Error using the database."
                });
            }
            
            con.query(insertQuery, [data["Property ID"], data["First Name"], data["Last Name"], data["Username"], data["Email"], data["Password"]], (err) => {
                if (err) {
                    console.error("Error inserting the user data: ", err);
                    const message = " Error inserting the user data.\n";
                    log(message);
                    return res.status(500).json({
                        success: false,
                        message: "Error inserting the user data."
                    });
                }
                
                const message = ` User Created. Data Inserted to table ${data['Property ID']}.\n`;
                log(message);
                return res.status(200).json({
                    success: true,
                    message: `${data['Username']} User Created Successfully.`
                });
            });
        });
    } catch (error) {
        console.error("Error Creating the User, server: ", error);
        return res.status(500).json({
            success: false,
            message: "Error Creating the User, server"
        });
    }
}

async function log(message) {
    const log = timestamp + message;
    fs.writeFile("database.log", log, { flag: 'a' }, function(err) {
        if (err) {
            console.error("Error writing to log file: ", err);
        }
    });
}


module.exports = {createUser}