/**
 * Created by chris on 3/13/14.
 */

var ctrl = require('../app_server/controllers/user.js');
var expressJwt = require('express-jwt');
var tokenSecret = require('../config/token');


module.exports = function(app){
    app.get('/user/create', ctrl.createUser);
    app.post('/user/create', ctrl.saveUser);
    app.get('/user/:username', ctrl.viewUser);

    app.post('/authenticate', ctrl.createToken);
    app.get('/api/user', expressJwt({secret: tokenSecret.secret}),ctrl.viewUser);

};