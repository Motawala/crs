const sendGrid = require('@sendgrid/mail');
const { con } = require("../controllers/register");
const {log} = require("../controllers/user")

sendGrid.setApiKey("<Send Grid API>")


async function sendEmail(){
    const messageData = {
        to:"karanp3898@gmail.com",
        from:"pkaran1100@gmail.com",
        subject:"Test Email",
        text:"Hello from KP CRS."
    };
    try{
        await sendGrid.send(messageData);
        console.log("Email Sent")
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
        subject:"Verficiation code for Password Reset",
        text:`Hello, \n Your Verification Code for Password Reset is: ${code}.\n`
    };
    try{
        await sendGrid.send(messageData);
        console.log("Email Sent")
    }catch(error){
        console.log(error)
    }
}
module.exports = {sendEmail, generateVerificationCode, verifyCode}