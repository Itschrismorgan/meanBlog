/**
 * Created by chris on 3/1/14.
 */
/* Posts routes */

var ctrl = require('../app_server/controllers/posts.js');
var apiCtrl = require('../app_server/controllers/apiPosts.js');
var expressJwt = require('express-jwt');
var tokenSecret = require('../config/token');


module.exports = function(app){
    app.get('/posts/create', ctrl.createPosts);
    app.post('/posts/create', ctrl.savePosts);
    app.get('/posts/edit/:id',ctrl.editPosts);
    app.post('/posts/edit',ctrl.updatePosts);
    app.get('/posts/:id', ctrl.posts);

    app.get('/api/posts',apiCtrl.posts);
    app.get('/api/posts/:id', apiCtrl.post);
    app.post('/api/posts/:id', expressJwt({secret: tokenSecret.secret}),apiCtrl.updatePost);
};