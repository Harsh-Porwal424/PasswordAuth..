//jshint esversion:6
//Basic Header Files........
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

//Setting & Using Various Engines........
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'Our Little World...',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());



//Mongoose Setup Files........
mongoose.set('strictQuery', false);
const url = process.env.URL;
mongoose.connect(url, { useNewUrlParser: true });

//-------->Mongoose Encryption Technique<----------
// var encrypt = require('mongoose-encryption');  ///Mongose Encrption code....
//-------->MD5 Encryption Technique<---------------
// const md5 = require('md5');
//-------->bcrypt Encryption Technique<------------
// const bcrypt = require('bcryptjs');
// const saltRound = 10;



//MogoDB collection Schemaa..........
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


// Add any other plugins or middleware here. For example, middleware for hashing passwords
//const secret = process.env.SECRET
//Encryptions works......
// userSchema.plugin(encrypt, { secret: secret, encryptedFields : ["password"] });


//New Mongoose Model.....
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (User, done) {
    done(null, User);
});

passport.deserializeUser(function (User, done) {
    done(null, User);
});

//Severals Get Requests..........
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/secrets", (req, res) => {

    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

////////////////////////////////Function To Register the new Account in DB ////////////////////////////


app.post("/register", (req, res) => {


    // bcrypt.hash(req.body.password, saltRound, function(err, hash) {


    //     const newUser = new User({
    //         email : req.body.username,
    //         password : hash
    //     });

    //     newUser.save(function(err){
    //         if(err){
    //             console.log(err);
    //         }else{
    //             console.log("Sucessfully Saved....");
    //             res.render("secrets");
    //         }
    //     });

    // });


    User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {

            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });

        }
    });

});

////////////////////////////////Function To Verify the Login ////////////////////////////

app.post("/login", (req, res) => {

    // const userName = req.body.username;
    // const Password = req.body.password;

    // User.findOne({email : userName }, function(err, foundUser){
    //     if(err){
    //         console.log(err);
    //     }
    //     if(foundUser){

    //         bcrypt.compare(Password, foundUser.password, function(err, result) {
    //             if(result === true){
    //                 res.render("secrets");
    //             }
    //         });
    //     }
    // });


    const user = new User({
        userName: req.body.username,
        Password: req.body.password
    })

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    })

});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});
