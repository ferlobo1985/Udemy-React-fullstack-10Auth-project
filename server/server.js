const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const mongoUri = 'mongodb+srv://admin:testing123@cluster0.3nee9.mongodb.net/authApp?retryWrites=true&w=majority';
mongoose.connect(mongoUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex',true);

/// MIDDLEWARE
app.use(bodyParser.json());

/// MODELS
const { User } = require('./models/user');

/// ROUTES
app.post('/api/user',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.spassword
    });

    user.save((err,doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send(doc);
    });
});


app.post('/api/user/login',(req,res)=>{
    // 1 - Find the user, if good ->
    User.findOne({'email': req.body.email},(err, user)=>{
        if(!user) res.json({message:'User not found'});

        // 2 - compare the string with the hash -> 
        user.comparePassword( req.body.password , (err, isMatch)=>{
            if(err) res.json({message:'Bad password'});
            res.status(200).send(isMatch)
        })
    })
});



const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Started on port ${port}`)
})