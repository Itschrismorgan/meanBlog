/**
 * Created by chris on 3/13/14.
 */

var ctrl = require('../app_server/controllers/user.js');

module.exports = function(app){
    app.get('/user/login', ctrl.login);
    app.post('/user/login',ctrl.authUser);
    app.get('/user/create', ctrl.createUser);
    app.post('/user/create', ctrl.saveUser);
    app.get('/user/logout', ctrl.logout);
};