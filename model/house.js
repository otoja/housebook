var db = require('../db');
var addressModel = require('../model/address');

var house = db.Schema({
    name: {type: String, select: true, required: true},
    type: {type: String, select: true, required: false},
    createdBy: {type: db.Schema.Types.ObjectId, ref: 'User', required: true},
    inhabitants: [{type: db.Schema.Types.ObjectId, ref: 'User', required: false}],
    manuals: [{type: String, required: false}],
    pictures: [{type: db.Schema.Types.ObjectId, ref: 'Image', required: false}],
    profilePicture: {type: db.Schema.Types.ObjectId, ref: 'Image', required: false},
    backgroundPicture: {type: db.Schema.Types.ObjectId, ref: 'Image', required: false},
    address: {type: addressModel.schema},
    builtYear: {type: Number, required: false}
});
module.exports = db.model('House', house);