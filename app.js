
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var dustjs = require('adaro');
var mongoose = require('mongoose');

var app = express();

app.engine('dust',dustjs.dust({}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'dust');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('letsgetitstarted'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
require('./app_server/models');
require('./routes')(app);



mongoose.connect('mongodb://localhost/meanBlog', function(err){

    if(err){
        console.log('Error connecting to MongoD!!!');
        throw(err);
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

});
