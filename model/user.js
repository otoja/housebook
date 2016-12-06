var db = require('../db');
require('./house');

var user = db.Schema({
    username: {type: String, select: true, unique:true},
    firstName: {type: String, select: true},
    lastName: {type: String, select: true},
    email: {type: String, select: true, unique:true},
    password: {type: String, select: false},
    needToChangePassword: {type: Boolean, select: false},
    expire: {type: Date, default: Date.now},
    roles: {type:Array, select:true},
    createdHouseProfile:[{ type : db.Schema.Types.ObjectId, ref : 'House', required:false}]
});

module.exports = db.model('User', user);
