/**
 * Created by chrismorgan on 12/13/14.
 */

var mongoose = require('mongoose');
var posts = mongoose.model('Posts');

exports.posts = function(req, res){
    if(req.query['index'] && req.query['count']){
        posts.find().sort('-creationDate').select('-postText').skip(req.query['index']).limit(req.query['count']).exec(function(err, previews){
            res.set('Content-Type','application/json');
            res.send(previews);
        });

    } else {
        posts.find().sort('-creationDate').select('-postText').limit(10).exec(function(err, previews){
            res.set('Content-Type','application/json');
            res.send(previews);
        });

    }
};

exports.post = function(req, res){
    posts.findOne({'_id':req.params.id}).exec(function(err, postToView){
        res.set('Content-Type', 'application/json').send(postToView);
    });
};

exports.updatePost = function(req, res){
    if(!req.params.id || !req.body.preview || !req.body.title || !req.body.author || !req.body.post || !req.body.tags){
        res.status(400).set('Content-Type','application/json').json({code: 400, message:'Not all required elements provided.'})
    }

    posts.findOne({'_id':req.params.id},function(err, postToUpdate){
        if(postToUpdate){
            postToUpdate.title = req.body.title;
            postToUpdate.author = req.body.author;
            postToUpdate.postPreview = req.body.preview;
            postToUpdate.postText = req.body.post;
            postToUpdate.tags = req.body.tags;
            postToUpdate.save();
            res.set('Content-Type', 'application/json').json(postToUpdate);
        } else {
            var postToCreate = {};
            postToCreate._id = req.params.id;
            postToCreate.title = req.body.title;
            postToCreate.author = req.body.author;
            postToCreate.postPreview = req.body.preview;
            postToCreate.postText = req.body.post;
            postToCreate.tags = req.body.tags;
            posts.create(postToCreate, function(err, createdPost){
                if(err){
                    res.status(500).set('Content-Type','application/json').json({code: 500, message:'Some error occurred trying to create the post.'})
                    console.log('Error creating post!');
                }
                res.set('Content-Type','application/json').json(createdPost);
            });
        }
    });
};

