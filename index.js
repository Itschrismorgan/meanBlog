
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var swig = require('swig');
var app = express();
//var expressJwt = require('express-jwt');
//var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');


//var tokenSecret = require('./config/token.js');

http.globalAgent.maxSockets = Infinity;

app.engine('html',swig.renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'html');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.json());
//app.use(express.cookieParser('letsgetitstarted'));
//app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//for dev
swig.setDefaults({cache: false});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
require('./app_server/models');
require('./routes')(app);



mongoose.connect('mongodb://localhost/meanBlog', function(err){

    if(err){
        console.log('Error connecting to MongoDB!!!');
        throw(err);
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

});
