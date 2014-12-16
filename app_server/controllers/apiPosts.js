/**
 * Created by chrismorgan on 12/13/14.
 */

var mongoose = require('mongoose');
var posts = mongoose.model('Posts');
var userCtrl = require('./user');



exports.posts = function(req, res){
    posts.find().sort('-creationDate').select('-postText').limit(10).exec(function(err, previews){
        res.set('Content-Type','application/json');
        res.send(previews);
    });
};