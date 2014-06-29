/**
 * Created by chris on 3/1/14.
 */

var mongoose = require('mongoose');
var posts = mongoose.model('Posts');


exports.posts = function(req, res){
    posts.findOne({'_id':req.params.id}).select('-postPreview').exec(function(err, postToView){
        //console.log(postToView);
        res.render('posts',postToView);
    });
};

exports.editPosts = function(req, res){
    if(req.session.isLoggedIn){
        posts.findOne({'_id':req.params.id},function(err, postToEdit){
            console.log(postToEdit);
            res.render('editPosts',postToEdit);
        });
    } else {
        res.redirect('/');
    }
};

exports.updatePosts = function(req, res, next){
    if(req.session.isLoggedIn){
        posts.findOne({'_id':req.param('slug')},function(err, postToUpdate){
            postToUpdate.title = req.param('title');
            postToUpdate.author = req.param('author');
            postToUpdate.postPreview = req.param('preview');
            postToUpdate.postText = req.param('post');
            postToUpdate.tags = req.param('tags');
            postToUpdate.save();
            res.redirect('/posts/'+req.param('slug'));
        });
    } else {
        res.redirect('/');
    }
};

exports.createPosts = function(req, res){
    if(req.session.isLoggedIn) {
        res.render('createPosts', {title: 'Create a posts'})
    } else {
        console.log('Not logged in! Create post form disallowed!');
        res.redirect('/');
    }
};

exports.savePosts = function(req, res, next){
    if(req.session.isLoggedIn){
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
    } else {
        console.log('Error creating post! - Not logged in.');
        res.redirect('/');
    }
};