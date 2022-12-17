//jshint esversion:6
//Basic Header Files........
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const md5 = require('md5');

//Mongoose Setup Files........
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const url = process.env.URL;
mongoose.connect(url, { useNewUrlParser: true });

//Mongoose Encryption Technique
// var encrypt = require('mongoose-encryption');  ///Mongose Encrption code....



const app = express();
//Setting & Using Various Engines........
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



//MogoDB collection Schemaa..........
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords
const secret = process.env.SECRET
//Encryptions works......

// userSchema.plugin(encrypt, { secret: secret, encryptedFields : ["password"] });


//New Mongoose Model.....
const User = new mongoose.model("User", userSchema);

//Severals Get Requests..........
app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/login", (req, res) =>{
    res.render("login");
});


app.get("/register", (req, res) =>{
    res.render("register");
});

////////////////////////////////Function To Register the new Account in DB ////////////////////////////


app.post("/register", (req, res) =>{

    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Sucessfully Saved....");
            res.render("secrets");
        }
    });

});

////////////////////////////////Function To Verify the Login ////////////////////////////

app.post("/login", (req, res) =>{

    const userName = req.body.username;
    const Password = md5(req.body.password);

    User.findOne({email : userName }, function(err, foundUser){
        if(err){
            console.log(err);
        }
        if(foundUser){
            if(foundUser.password === Password){
                res.render("secrets");
            }
        }
    });

});





app.listen(3000, function () {
  console.log("Server started on port 3000");
});
