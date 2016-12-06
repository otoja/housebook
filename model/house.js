var db = require('../db');

var house = db.Schema({
    name: {type: String, select: true, required: true},
    type: {type: String, select: true, required: true},
    createdBy: {type: db.Schema.Types.ObjectId, ref: 'User', required: true},
    cohabitants: [{type: db.Schema.Types.ObjectId, ref: 'User'}],
    manuals:[{type:String}],
    pictures:[{type: db.Schema.Types.ObjectId, ref: 'Image'}]
});
module.exports = db.model('House', house);