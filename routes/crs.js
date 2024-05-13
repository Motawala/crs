const express = require('express')
const router = express.Router();
const {con, writeJSON, createDB} = require("../controllers/register")
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


module.exports = router