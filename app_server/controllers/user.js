/**
 * Created by chris on 3/13/14.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var user = mongoose.model('User');


exports.login = function(req, res){
    res.render('login');
};

exports.authUser = function(req, res, next){
    // validate input
    var username = cleanString(req.param('user'));
    var pass = cleanString(req.param('pass'));
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
        res.redirect('/user/'+username);  // Redirect to user hub
    });

};



exports.posts = function(req, res){
    posts.findOne({'_id':req.params.id}).select('-postPreview').exec(function(err, postToView){
        console.log(postToView);
        res.render('posts',postToView);
    });
};

exports.createPosts = function(req, res){
    res.render('createPosts', {title: 'Create a posts'})
};

exports.savePosts = function(req, res, next){

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
};


var hash = function(pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass, 'utf8');
    hash.update(salt, 'utf8');
    return hash.digest('base64');
};