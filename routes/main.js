/**
 * Created by chris on 3/1/14.
 */

var ctrl = require('../app_server/controllers/main');

module.exports = function(app){
    app.get('/',ctrl.index);
    app.get('/about',ctrl.about);
};