/*
 * GET home page.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');


exports.index = function(req, res){
    res.render('layout');
};