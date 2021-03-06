/**
 * Created by chris on 3/13/14.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');
var posts = mongoose.model('Posts');
var jwt = require('jsonwebtoken');
var tokenSecret = require('../../config/token');


exports.createUser = function(req, res){
    var salt = genSalt();
    var passwordHash = hash(req.body.password,salt);

    var userToCreate = {
        '_id': req.body.username,
        'name': {'first': req.body.firstName, 'last': req.body.lastName},
        'salt': salt,
        'hash': passwordHash
    };

    user.create(userToCreate, function(err, createdUser){
        if(err){
            res.status(500).set('Content-Type','application/json').json({code: 500, message:'Error creating user'});
        }
        res.set('Content-Type','application/json').json({code: 200, message: 'User created'});
    });
};

exports.viewUser = function(req, res){
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, tokenSecret.secret);
    var userName = payload.name;
    user.findOne({'_id':userName}).exec(function(err,userToView){
        var returnJson = {};
        returnJson.username = userToView._id;
        returnJson.name = userToView.name;
        res.set('Content-Type','application/json');
        res.send(returnJson);
    });
};

exports.createToken = function(req, res){
    var username = req.body.username;
    var pass = req.body.password;

    var profile = {};
    var expiration = {};

    if (!(username && pass)) {
        profile.name = 'guest';
        profile.level = 'guest';
        expiration = {expiresInMinutes: 60*60};

        var token = jwt.sign(profile,tokenSecret.secret, expiration);

        res.json({token: token});
    }

    user.findById(username, function(err, user){
        if (err) return next(err);

        // No user found in DB
        if (!user) {
            res.status(400).json({code: 400, message: 'Unknown user'});
            return;
        }

        // check password
        if (user.hash != hash(pass,user.salt)){
            res.status(401).json({code: 401, message: 'Invalid credentials'});
            return;
        }

        profile.name = user._id;
        profile.level = 'admin';
        expiration = {expiresInMinutes: 60*5};
        var token = jwt.sign(profile,tokenSecret.secret, expiration);

        console.log(username+" authenticated!");
        res.json({token: token});  // Redirect to user hub
    });

};


var hash = function(pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass, 'utf8');
    hash.update(salt, 'utf8');
    return hash.digest('base64');
};

var genSalt = function(){
    var salt = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&!@#$%^&*()<>?{}[]|.,";

    for( var i=0; i < 5; i++ )
        salt += possible.charAt(Math.floor(Math.random() * possible.length));

    return salt;
};

var cleanString = function(str){

};