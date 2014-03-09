/**
 * Created by chris on 3/8/14.
 */
var mongoose = require('mongoose');


var schema = mongoose.Schema({
    _id: {type: String, required: true},
    title: {type: String, required:true},
    author: {type: String, required:true},
    creationDate: {type: Date, default: Date.now()},
    editedDate:{type: Date},
    postPreview: {type: String, required:true},
    postText: {type: String, required:true},
    tags: {type: [String]}
});



var Posts = mongoose.model('Posts', schema);