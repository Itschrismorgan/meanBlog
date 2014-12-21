/**
 * Created by chrismorgan on 12/13/14.
 */

var mongoose = require('mongoose');
var posts = mongoose.model('Posts');
var userCtrl = require('./user');



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
    posts.findOne({'_id':req.params.id}).select('-postPreview').exec(function(err, postToView){
        res.set('Content-Type', 'application/json').send(postToView);
    });
};

exports.updatePost = function(req, res){
    console.log('check');
    res.set('Content-Type', 'application/json').json({hello: 'world'});
};