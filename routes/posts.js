/**
 * Created by chris on 3/1/14.
 */
/* Posts routes */

var ctrl = require('../app_server/controllers/posts.js');

module.exports = function(app){
    app.get('/posts/create', ctrl.createPosts);
    app.post('/posts/create', ctrl.savePosts);
    app.get('/posts/:id', ctrl.posts);
};