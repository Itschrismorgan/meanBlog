/*
 * GET home page.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');


exports.index = function(req, res){
    Posts.find().sort('creationDate').select('-postText').limit(10).exec(function(err, previews){
        console.log(previews);
        var postPreviews = {'postPreviews': previews};
        res.render('index',postPreviews);
    });
};

exports.about = function(req, res){
    res.render('about', {title: 'About us' });
};