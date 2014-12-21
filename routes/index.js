
module.exports = function(app, apiSecret){
    require('./main')(app);
    require('./posts')(app,apiSecret);
    require('./photos')(app);
    require('./user')(app,apiSecret);
};