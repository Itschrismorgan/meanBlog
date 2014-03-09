/**
 * Created by chris on 3/1/14.
 */

var mongoose = require('mongoose');
var posts = mongoose.model('Posts');


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