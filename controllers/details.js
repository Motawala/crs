const { get } = require("http");
const { con } = require("../controllers/register");
const {log} = require("../controllers/user")
const fs = require('fs')

const getPropertyDetails = async (req, res) => {
    try {
        console.log(req.session.username)
    }catch(error){

    }
}

module.exports = {getPropertyDetails}