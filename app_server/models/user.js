/**
 * Created by chris on 3/13/14.
 */
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id: { type: String, lowercase: true, trim: true} // username
    , name: { first: String, last: String }
    , salt: { type: String, required: true }
    , hash: { type: String, required: true }
});

// properties that do not get saved to the db
schema.virtual('fullname').get(function () {
    return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('User', schema);