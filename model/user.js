var db = require('../db');

var user = db.Schema({
    username: {type: String, select: true, unique: true},
    firstName: {type: String, select: true},
    lastName: {type: String, select: true},
    email: {type: String, select: true, unique: true},
    password: {type: String, select: false},
    needToChangePassword: {type: Boolean, select: false},
    expire: {type: Date, default: Date.now},
    roles: {type: Array, select: true},
    createdHouseProfile: [{
            ref: {type: db.Schema.Types.ObjectId, ref: 'House', required: false},
            name: {type: String, required: true, select: true},
            thumbnail: {type: String, required: true, select: true}
        }]
});

module.exports = db.model('User', user);
