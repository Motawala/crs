var mysql = require('mysql');
const date = new Date();
const timestamp = date.toLocaleString() + ":-";
var fs = require('fs');
const { con } = require("../controllers/register");
const bcrypt = require("bcryptjs");
const isAuth = require("../middleware/isAuth")
const session = require("../index")
const {sendCreateAccountEmail} = require("../controllers/email")

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
                    if(err.code == 'ER_DUP_ENTRY'){
                        console.error("Duplicate entry error: ", err);
                        const message = "Duplicate entry error.\n";
                        log(message);
                        return res.status(409).json({
                            success: false,
                            message: "Duplicate entry. This username or email already exists."
                        });
                    }
                    return res.status(500).json({
                        success: false,
                        message: "Error inserting the user data."
                    });
                }
                
                const message = `User Created. Data Inserted to table ${data['Property ID']}.\n`;
                log(message);
                sendCreateAccountEmail(data)
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
        const propId = data['Property ID']
        let propertyName;
        const filename = propId + '.json'
        let propertyDetail;
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                return;
            }
            try {
                propertyDetail = JSON.parse(data);
                req.session.propertyName = (propertyDetail['data']['Property Name'])
                req.session.totalRooms = propertyDetail['data']['Number of Rooms']
                req.session.roomData = propertyDetail['roomData']
                req.session.propertyData = propertyDetail['data']
                propertyName = propertyDetail['data']['Property Name']
            } catch (jsonErr) {
                console.error("Error parsing JSON:", jsonErr);
            }
        });
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
                const message = ` Using property ${data['Property ID']}.\n`;
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
                                req.session.isAuth = true;
                                req.session.username = data["Username"]
                                req.session.name = result[0].firstname;
                                req.session.propertyid = data['Property ID']
                                const message = ` User ${data["Username"]} logged in.\n`
                                log(message)
                                return res.status(200).json({
                                    success: true,
                                    message: "Valid User found"
                                });
                            }else{
                                req.session.error = "Username/Password Does not match."
                                const message = " Invalid User.\n";
                                log(message);
                                return res.status(500).json({
                                    success: false,
                                    message: "Invalid credentials."
                                });
                            }
                        }else{
                            req.session.error = "User not found in the database."
                            const message = " User Not Found.\n";
                            log(message);
                            return res.status(500).json({
                                success: false,
                                message: "User not found."
                            });
                        }
                    }else{
                        req.session.error = "Results not found."
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



const userData = async (req, res) => {
    try {
        const  data  = req.body;
        const propertyID = data['userData']['Property ID']
        const username = data['userData']["Username"]
        const email = data['userData']['Email']
        const useQuery = `USE ${propertyID};`;
        const sqlQuery = `SELECT * FROM users WHERE username = '${username}' AND email = '${email}';`;
        
        con.query(useQuery, (err, results, fields) => {
            if (err) {
                console.error("Error Using the Database, Req made: ", err);
                const message = ` Error querying use database ${data['Property ID']}.\n`;
                log(message);
                return res.status(500).json({
                    success: false,
                    message: "Error using the database."
                });
            } else {
                const message = ` Using ${data['userData']['Property ID']}.\n`;
                log(message);
            }

            con.query(sqlQuery, async (err, result, fields) => {
                if(err){
                    console.error("Error makiing the request to the Database, Req made: ", err);
                    const message = ` Error finding the record for ${data['Property ID']}.\n`;
                    log(message);
                    return res.status(500).json({
                        success: false,
                        message: "Error finding the record."
                    });
                }else{
                    if(result.length > 0){
                        if(result[0]['username'] == username && result[0]['email'] == email){
                            const message = ` User Found with the Mathching username ${data['userData']['Username']}.\n`;
                            log(message);
                            return res.status(200).json({
                                success: true,
                                message: "Valid User found"
                            });
                        }else{
                            return res.status(500).json({
                                success: false,
                                message: "Error finding the record."
                            });
                        }
                    }else{
                        return res.status(500).json({
                            success: false,
                            message: "Error finding the record."
                        });
                    }
                }
            })
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error finding the record."
        });
    }
}


const resetPassword = async (req, res) => {
    const data = req.body
    const propertyID = data['resetData']['Property ID']
    const username = data['resetData']['Username']
    const useQuery = `USE \`${propertyID}\``
    const salt = await bcrypt.genSalt(10);
    const encrypt = await bcrypt.hash(data['resetData']["New Password"], salt);
    const updateQuery = 'UPDATE users SET password = ? WHERE username = ?'
    try{
        con.query(useQuery, (err, results, fields) => {
            if (err) {
                console.error("Error Using the Database, Req made: ", err);
                const message = ` Error querying use database ${propertyID}.\n`;
                log(message);
                return res.status(500).json({
                    success: false,
                    message: "Error using the database."
                });
            } else {
                const message = ` Using ${propertyID}.\n`;
                log(message);
                con.query(updateQuery, [encrypt, username], (err, results, fields) =>{
                    if(err){
                        console.error("Error Updating the Password: ", err);
                        const message = ` Error Updateing the Password.\n`;
                        log(message);
                        return res.status(500).json({
                            success: false,
                            message: "Error updating the Password."
                        });
                    }else{
                        if(results){
                            const message = ` User ${username}'s Password Updated.\n`;
                            log(message);
                            return res.status(200).json({
                                success: true,
                                message: "Password Updated"
                            });
                        }else{
                            console.error("Error Updating the Password: ", err);
                            const message = ` Error Updateing the Password.\n`;
                            log(message);
                            return res.status(500).json({
                                success: false,
                                message: "Error updating the Password."
                            });
                        }
                    }
                })
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Updating the Password."
        });
    }
}

const logout = async (req,res)=>{
    try{
        const message = ` User ${req.session.username}'s logged out.\n`;
        if(req.session.isAuth == true){
            req.session.destroy.username;
            req.session.destroy()
            log(message);
            return res.status(200).json({
                success: true,
                message:"logout successful"
            })
        }else{
            return res.status(500).json({
                success: false,
                message: "Logout Unsuccessful, login first."
            });
        }
    }catch(err){
        const message = ` User ${req.session.username}'s not logged out.\n`;
        return res.status(500).json({
            success: false,
            message: "Error Logging out user"
        });
    }
}


async function log(message) {
    const logMessage = timestamp + message;
    fs.writeFile("database.log", logMessage, { flag: 'a' }, function(err) {
        if (err) {
            console.error("Error writing to log file: ", err);
        }
    });
}


module.exports = { createUser, login, userData, log, resetPassword, logout};
