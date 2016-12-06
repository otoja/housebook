var jwt = require('jwt-simple');
var config = require('./config');

module.exports=function(req, res, next){
  if (req.headers['x-auth']){
      console.log("x-auth token in auth.js");
      req.auth = jwt.decode(req.headers['x-auth'], config.secret);
      console.log(req.auth);
  }  
  next();
};