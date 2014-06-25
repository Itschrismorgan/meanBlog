/**
 * Created by chris on 3/13/14.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');


exports.login = function(req, res){
    res.render('login');
};

exports.logout = function(req, res){
    req.session.isLoggedIn = false;
    res.redirect('/');
};

exports.authUser = function(req, res, next){
    // validate input
    //var username = cleanString(req.param('username'));
    //var pass = cleanString(req.param('password'));
    var username = req.param('username');
    var pass = req.param('password');
    if (!(username && pass)) {
        return failedLogin();
    }

    user.findById(username, function(err, user){
        if (err) return next(err);

        // No user found in DB
        if (!user) { return failedLogin();}

        // check password
        if (user.hash != hash(pass,user.salt)){return failedLogin();}

        req.session.isLoggedIn = true;
        req.session.user = username;
        console.log(username+" logged in!");
        res.redirect('/user/'+username);  // Redirect to user hub
    });

};

exports.createUser = function(req, res){
    res.render('createUsers', {title: 'Create a user'})
};

exports.saveUser = function(req, res, next){
    // validate input
    if(req.session.isLoggedIn){

    } else {
        user.count({}, function(err, c){
            if (c === 0){
                var salt = genSalt();
                console.log(salt);
                var passwordHash = hash(req.param('password'),salt);
                console.log(passwordHash);
                var userToCreate = {
                    '_id': req.param('username'),
                    'user': {'first': req.param('firstName'), 'last': req.param('lastName')},
                    'salt': salt,
                    'hash': passwordHash
                };
                console.log(userToCreate);

                user.create(userToCreate, function(err, createdUser){
                    if(err){
                        console.log('Error creating user!');
                        throw err;
                    }
                    res.redirect('/user/'+createdUser._id);
                });

            }
        });
    }

};

/*exports.posts = function(req, res){
    posts.findOne({'_id':req.params.id}).select('-postPreview').exec(function(err, postToView){
        console.log(postToView);
        res.render('posts',postToView);
    });
};*/

/*exports.createPosts = function(req, res){
    console.log(req.session.isLoggedIn);
    if(req.session.isLoggedIn) {
        res.render('createPosts', {title: 'Create a posts'})
    } else {
        console.log('Not logged in! Create post form disallowed!');
        res.redirect('/');
    }
};*/

/*exports.savePosts = function(req, res, next){

    console.log(req.param('slug'));
    console.log(req.body);

    var postToCreate = {
        _id: req.param('slug'),
        title: req.param('title'),
        author: req.param('author'),
        postPreview: req.param('preview'),
        postText: req.param('post'),
        tags: req.param('tags')
    };

    posts.create(postToCreate, function(err, createdPost){
        if(err){
            console.log('Error creating post!');
            throw err;
        }
        res.redirect('/posts/'+createdPost._id);
    });
};*/


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