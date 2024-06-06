const express = require('express')
const router = express.Router();
const {con, writeJSON, createDB, validatePropertyID} = require("../controllers/register")
const {createUser, login, userData, resetPassword, logout} = require("../controllers/user")
const {isAuth} = require('../middleware/isAuth')
const {sendEmail, generateVerificationCode, verifyCode} = require("../controllers/email")
const {getPropertyDetails} = require("../controllers/details")
var fs = require('fs');


//Redirects the user to the home page
router.get('/', function(req,res){
    res.render('index',{title:'CRS'});
})

router.get('/register', function(req,res){
    try{
        res.render('register',{title:"Register Property"})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})


router.get('/signIn', function(req,res){
    try{
        res.render('signIn',{title:"Sign-In"})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})

router.get('/dashboard', isAuth, function(req,res){
    try{
        res.render('dashboard',{title:"dashboard"})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})

router.get('/getUsername', isAuth, function(req,res){
    try{
        const usr = req.session.username
        const name = req.session.name
        const propertyid = req.session.propertyid
        const propertyName = req.session.propertyName
        const totalRooms = req.session.totalRooms
        const roomData = req.session.roomData
        const propertyData = req.session.propertyData
        res.json({usr, name, propertyid, propertyName, totalRooms, roomData, propertyData})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})


router.get('/forgot', function(req,res){
    try{
        res.render('forgot',{title:"Forgot Passowrd", username: req.session.username})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})

router.get('/createAccount', function(req,res){
    try{
        res.render('createAccount',{title:"Create Account"})
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
})


router.get('/users', (req, res) => {
    
    con.query("CREATE DATABASE mydb1", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
});


router.post('/storePropertyDetails', writeJSON)
router.post('/createDB', createDB)
router.post('/validatePropertyID', validatePropertyID)
router.post("/createUser", createUser)
router.post("/login", login)
router.post('/userData', userData)
router.post('/sendVerificationEmail', generateVerificationCode)
router.post('/verifyCode', verifyCode)
router.post('/resetPassword', resetPassword)
router.post('/getPropertyDetails', getPropertyDetails)
router.post('/logout', logout)

module.exports = router