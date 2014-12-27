/**
 * Created by chris on 3/13/14.
 */

var ctrl = require('../app_server/controllers/user.js');
var expressJwt = require('express-jwt');
var tokenSecret = require('../config/token');


module.exports = function(app){
    app.post('/authenticate', ctrl.createToken);
    app.get('/api/user', expressJwt({secret: tokenSecret.secret}),ctrl.viewUser);
    app.post('/api/user', expressJwt({secret: tokenSecret.secret}),ctrl.createUser);
};