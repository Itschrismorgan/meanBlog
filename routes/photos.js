/**
 * Created by chris on 3/1/14.
 */
/* Posts routes */

var ctrl = require('../app_server/controllers/photos.js');

module.exports = function(app){
    app.get('/photos', ctrl.photos);
};