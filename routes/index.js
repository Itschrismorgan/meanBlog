
module.exports = function(app){
    require('./main')(app);
    require('./posts')(app);
    require('./photos')(app);
    require('./user')(app);
};