const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();

const mongoUri = config.DATABASE;
mongoose.connect(mongoUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex',true);

/// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
const { authenticate } = require('./middleware/auth'); 

/// MODELS
const { User } = require('./models/user');

/// ROUTES
app.post('/api/user',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
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
            if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message:'Bad password'
            });
            
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('auth', user.token).send('ok')
            })
        })
    })
});


app.get('/api/books',authenticate,(req,res)=>{
    res.status(200).send(req.email);

    // let token = req.cookies.auth;
    // User.findByToken(token,(err,user)=>{
    //     if(err) throw err;
    //     if(!user) return res.status(401).send({ message:'bad token'});
    //     res.status(200).send(user)
    // })
})


const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Started on port ${port}`)
})