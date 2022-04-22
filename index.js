const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const marked = require('marked');
const app = express();
const dotenv = require('dotenv').config()
const port = 3000;
console.log("pre mongoose stat")
const mongodb = process.env.SRV
const recipeModel = require('./models/recipe');
const userModel = require('./models/user');
const tokenModel = require('./models/token');
const hat = require('hat');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    breaks: true
})

mongoose.connect(mongodb).then(() => {
    console.log("Connected to mongodb!");

}).catch(err => {
    console.log("error in mongoose connection", err);
});

app.use(bodyParser.json());

console.log("post mongoose stat")


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.post('/create', (req, res) => {
    const auth = req.query.auth

    const randid = Math.floor(100000 + Math.random() * 900000)
    const newdata = req.body.data;
    const newauthor = req.body.author;
    const newtitle = req.body.title;
    const date = new Date();


    const newRecipe = new recipeModel({ id: randid, date_created: date, author: newauthor, data: marked.parse(newdata), title: newtitle });

    newRecipe.save(function (err, info) {
        if (err){
            console.log("error in saving data", err);
            res.status(500).send("error in saving data");

        }else {
        console.log("saved to database");
        res.send(info);
        }
    });


    
});

app.post('/create-user', (req, res) => {
    const randid = Math.floor(100000 + Math.random() * 900000);
    const datecreated = new Date();
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;
    const newUser = new userModel({
        date_created: datecreated,
        username: username,
        email: email,
        password: password,
        id: randid,
        bio: bio
    });
    newUser.save(function (err, info){
        if (err){
            console.log("error creating user:", err);
            res.status(500).send("Error in making user");
        }else{
            res.send(info)
        }


    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/user/:id', (req, res) => {
    const id = req.params.id;

    userModel.findOne({id: id}, function (err, info){
        if (err){
            console.log("error in finding user data", err)
            res.status(500).send("error in finding user data")
        }else{
            if (info == null){
                res.status(404).send("Cannot find user")
                res.end()
            }else{
                res.render('user', {
                    username: info.username,
                    date: info.date_created,
                    bio: info.bio
                })
            }
        }
    })
})

app.get('/recipe/:id', (req, res) => {

    const id = req.params.id;

    recipeModel.findOne({ id: id }, function (err, info) {
        if (err) {
            console.log("error in finding data", err);
            res.status(500).send("error in finding data");
        } else {

            if (info == null){
                res.send('404 - Not Found');
                res.end();
            }else{
                res.render('index', {
                    data: info.data,
                    name: info.title,
                    author: info.author,
                    date: info.date_created
    
                });    
            }
        };
    });
});

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/gen-token', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    userModel.findOne({email: email}, function (err, info) {
        if (err){
            console.log("error verifying user", err)
            res.status(500).json({
                error: "There has been an error logging in."
            })

        }else{
            if (info == null){
                res.status(404).json({
                    error: "There is no account with this email."
                })
            }else{
                if (!info.password === password){
                    res.status(403).json({
                        error: "Incorrect password, please try again."
                    })
                }else{
                    // gen token code
                    const newtoken = new tokenModel({
                        uid: info.id,
                        token: hat()
                    });

                    newtoken.save(function(err, info) {
                        if(err) {
                            res.status(500).json({
                                error: 'unknown error'
                            })
                        }else{
                            res.send(info)
                        }

                    })
                }
            }
        }
    })

})


app.get('/validate-token', (req, res) => {
    const auth = req.query.auth
    tokenModel.findOne({token: auth}, function(err, info) {
        if (info == null){
            res.send('Token is not valid')
        }else{
            res.send('Token is valid and associated with ' + info.uid)
        }

    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});