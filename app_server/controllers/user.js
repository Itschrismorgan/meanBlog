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
    if(req.session.isLoggedIn) {
        res.render('createUsers', {title: 'Create a user'})
    } else {
        user.count({}, function(err, c) {
            if (c === 0) {
                res.render('createUsers', {title: 'Create a user'});
            } else {
                console.log('No logged in! Create User!');
                res.redirect('/');
            }
        });
    }
};

exports.saveUser = function(req, res, next){
    // validate input
    if(req.session.isLoggedIn){
        createUser(req,res);
    } else {
        user.count({}, function(err, c){
            if (c === 0){
                createUser(req,res);
            } else {
                console.log('Invalid session!');
                res.redirect('/');
            }

        });
    }
};


var createUser = function(req, res){
    var salt = genSalt();
    //console.log(salt);
    var passwordHash = hash(req.param('password'),salt);
    //console.log(passwordHash);
    //console.log(req.param);
    var userToCreate = {
        '_id': req.param('username'),
        'name': {'first': req.param('firstName'), 'last': req.param('lastName')},
        'salt': salt,
        'hash': passwordHash
    };
    //console.log(userToCreate);

    user.create(userToCreate, function(err, createdUser){
        if(err){
            //console.log('Error creating user!');
            throw err;
        }
        res.redirect('/user/'+createdUser._id);
    });
};

exports.getUserObject = function(req){
    var userObj = {};
    userObj.isLoggedIn = req.session.isLoggedIn;
    //console.log(req.session);
    return userObj;
};

exports.viewUser = function(req, res){
    var userName = req.params.username;
    user.findOne({'_id':userName}).exec(function(err,userToView){
        posts.find().sort('creationDate').select('_id title creationDate').limit(10).exec(function(err, postList){
            //console.log(postList);
            //console.log(userToView);
            var userHub = {
                'postList': postList,
                'userInfo': userToView
            };
            res.render('userHub',userHub);
        });
    });
};

exports.createToken = function(req, res){
    //var username = req.param('username');
    //var pass = req.param('password');

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