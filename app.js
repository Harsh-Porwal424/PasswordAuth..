//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require('mongoose');
const url = "mongodb+srv://admin:admin@mycluster.qmuj2je.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);


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
        password : req.body.password
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
    const Password = req.body.password;

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
