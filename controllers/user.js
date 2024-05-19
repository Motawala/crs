var mysql = require('mysql');
const date = new Date();
const timestamp = date.toLocaleString() + ":-";
var fs = require('fs');
const { con } = require("../controllers/register");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
    try {
        const { data } = req.body;
        const insertQuery = "INSERT INTO users (propertyID, firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?, ?)";
        const useQuery = `USE ${data["Property ID"]}`;
        const salt = await bcrypt.genSalt(10);
        const encrypt = await bcrypt.hash(data["Password"], salt);
        con.query(useQuery, (err) => {
            if (err) {
                console.error("Error Using the Database, Req made: ", err);
                const message = `Error querying use database ${data['Property ID']}.\n`;
                log(message);
                return res.status(500).json({
                    success: false,
                    message: "Error using the database."
                });
            }
            
            con.query(insertQuery, [data["Property ID"], data["First Name"], data["Last Name"], data["Username"], data["Email"], encrypt], (err) => {
                if (err) {
                    console.error("Error inserting the user data: ", err);
                    const message = "Error inserting the user data.\n";
                    log(message);
                    return res.status(500).json({
                        success: false,
                        message: "Error inserting the user data."
                    });
                }
                
                const message = `User Created. Data Inserted to table ${data['Property ID']}.\n`;
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
};

const login = async (req, res) => {
    try {
        const { data } = req.body;
        const useQuery = `USE ${data["Property ID"]}`;
        const sqlQuery = `SELECT * FROM users WHERE username = (?)`;

        con.query(useQuery, (err) => {
            if (err) {
                console.error("Error Using the Database, Req made: ", err);
                const message = ` Error querying use database ${data['Property ID']}.\n`;
                log(message);
                return res.status(500).json({
                    success: false,
                    message: "Error using the database."
                });
            } else {
                const message = ` Using ${data['Property ID']}.\n`;
                log(message);
            }

            con.query(sqlQuery, [data["Username"]], async (err, result, fields) => {
                if (err) {
                    console.error("Username not found!", err);
                    const message = ` Username not found in the database ${data["Username"]}.\n`;
                    log(message);
                    return res.status(500).json({
                        success: false,
                        message: "Username not found."
                    });
                } else {
                    if (result.length >= 1) {
                        if (result[0].password) {
                            const passwordCompare = await bcrypt.compare(data["Password"], result[0].password);
                            if (passwordCompare) {
                                const message = ` User ${data["Username"]} logged in.\n`
                                log(message)
                                return res.status(200).json({
                                    success: true,
                                    message: "Valid User found"
                                });
                            } else {
                                const message = " Invalid User.\n";
                                log(message);
                                return res.status(500).json({
                                    success: false,
                                    message: "Invalid credentials."
                                });
                            }
                        } else {
                            const message = " User Not Found.\n";
                            log(message);
                            return res.status(500).json({
                                success: false,
                                message: "User not found."
                            });
                        }
                    } else {
                        const message = " Invalid Result.\n";
                        log(message);
                        return res.status(500).json({
                            success: false,
                            message: "User not found."
                        });
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error logging in the user, server: ", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in the user, server"
        });
    }
};

async function log(message) {
    const logMessage = timestamp + message;
    fs.writeFile("database.log", logMessage, { flag: 'a' }, function(err) {
        if (err) {
            console.error("Error writing to log file: ", err);
        }
    });
}

module.exports = { createUser, login };
