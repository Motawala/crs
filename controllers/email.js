const sendGrid = require('@sendgrid/mail');
const { con } = require("../controllers/register");
const {log} = require("../controllers/user")
const fs = require('fs')
require('dotenv').config();

sendGrid.setApiKey(process.env.SENDGRID_API)


async function sendEmail(){
    const messageData = {
        to:"karanp3898@gmail.com",
        from:"pkaran1100@gmail.com",
        subject:"Test Email",
        text:"Hello from KP CRS."
    };
    try{
        await sendGrid.send(messageData);
    }catch(error){
        console.log(error)
    }
}


const generateVerificationCode = async (req, res) => {
    try {
        const {details} = req.body
        const propertyID = details['Property ID']
        const useQuery = `USE ${propertyID};`

        const code = generateRandomNumber(100000, 999999)
        const storeCodeQuery = "INSERT INTO verification (code) VALUES (?);"
        const filename = propertyID + '.json'
        let from;
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                return;
            }
            try {
                const detail = JSON.parse(data);
                from = detail['data']['Property Email']
            } catch (jsonErr) {
                console.error("Error parsing JSON:", jsonErr);
            }
        });
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
                con.query(storeCodeQuery, [code], (err, results, fields) =>{
                    if(err){
                        console.error("Error in storing the Verification Code, Req made: ", err);
                        const message = ` Error in storing verification code ${code}.\n`;
                        log(message);
                        return res.status(500).json({
                            success: false,
                            message: "Error creating token."
                        });
                    }else{
                        const message = ` verification code: ${code} stored.\n`;
                        log(message);
                        if(results){
                            sendVerificationEmail(code, details['Email'])
                        }
                        return res.status(200).json({
                            success: true,
                            message: "Using KP45193"
                        });
                    }
                })
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error using the database."
        });
    }
}

const verifyCode = async (req, res) => {
    try {
        const details = req.body
        const propertyID = details['verificationData']['Property ID']
        const verificationcode = details['verificationData']['Verification Code']
        const useQuery = `USE ${propertyID};`
        const findCode = `SELECT code FROM verification ORDER BY id DESC LIMIT 1;`
        const deletCode = `DELETE FROM verification WHERE code = ${verificationcode}`
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
                con.query(findCode, (err, results, fields) =>{
                    if(err){
                        console.error("Error finding the record, Req made: ", err);
                        const message = ` Error finding the record.\n`;
                        log(message);
                        return res.status(500).json({
                            success: false,
                            message: "Error finding the record."
                        });
                    }else{
                        if(results){
                            if(results[0]['code'] == verificationcode){
                                const message = ` User Verified Code.\n`;
                                log(message);
                                con.query(deletCode, (err, results, fields) =>{
                                    if(err){
                                        console.error("Error deleting the record, Req made: ", err);
                                        const message = ` Error deleting the record.\n`;
                                        log(message);
                                        return res.status(500).json({
                                            success: false,
                                            message: "Error deleting the record."
                                        });
                                    }else{
                                        return res.status(200).json({
                                            success: true,
                                            message: "Code matched and Deleted."
                                        });
                                    }
                                })
                            }else{
                                return res.status(500).json({
                                    success: false,
                                    message: "Error deleting the record."
                                });
                            }
                        }else{
                            return res.status(500).json({
                                success: false,
                                message: "Error deleting the record."
                            });
                        }
                    }
                })
                
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error using the database."
        });
    }
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function sendVerificationEmail(code, email){
    const messageData = {
        to:email,
        from:"pkaran1100@gmail.com",
        subject:"KP's CRS: Verficiation code for Password Reset",
        text:`Hello, \n Your Verification Code for Password Reset is: ${code}.\n`,
        html: resetPasswordEmailTemplate(code)
    };
    try{
        await sendGrid.send(messageData);
        console.log("Email Sent")
        const message = ` Verification Code sent to ${email} for Password Reset.\n`;
        log(message)
    }catch(error){
        console.log(error)
    }
}

async function sendCreateAccountEmail(propertyData){
    const email = propertyData['Email']
    const messageData = {
        to:email,
        from:"pkaran1100@gmail.com",
        subject:"KPs CRS: New Account Created.",
        html: createAccountTemplate(propertyData)
    };
    try{
        await sendGrid.send(messageData);
        console.log("Email Sent")
    }catch(error){
        console.log(error)
    }
}


function resetPasswordEmailTemplate(code){
    const logo = '/getLogo'
    const template = `
        <h1>KP's Central Reservation System User Verification.</h1>
        <p>Hello,</p>
        <p>You are receiving this email because we received a password request for your account. Here is your verfification code:</p>
        <div style="margin:auto; align-self:center; background-color:lightgrey; height:30px; width:100px; align-text:center;">
            <p style="font-weight:bold; margin:auto; align-self:center;">${code}</p>
        </div>
        <p>If you did not request a password reset, no furthur action is required.</p>
        <p>Regards,</p>
        <p>KP's Central Reservation System</p>
        <img src="/Images/KPs%20CRS.PNG" style="height:180px; width:200px"></img>`
    return template
        
}

function createAccountTemplate(data){
    const firstname = data['First Name']
    const lastname = data['Last Name']
    const propertyID = data['Property ID']
    const username = data['Username']
    const template = `
        <h1>Welcome to KP's Central Reservation System.</h1>
        <p>Hello ${firstname} ${lastname},</p><br>
        <p>You are receiving this email because your account is successfully created.</p>
        <div style="margin:auto; align-self:center; background-color:lightgrey; height:80px; width:250px; align-text:center;">
            <p style="font-weight:bold; margin:auto; align-self:center;">Username: ${username}</p>
            <p style="font-weight:bold; margin:auto; align-self:center;">Property ID: ${propertyID}</p>
        </div>
        <p>Regards,</p>
        <p>KP's Central Reservation System</p>
        <img src="/Images/KPs%20CRS.PNG" style="height:180px; width:200px"></img>`
    return template
        
}

module.exports = {sendEmail, generateVerificationCode, verifyCode, sendCreateAccountEmail}