var db = require('../db');

var address = db.Schema({
    street1: {type: String, required: true},
    street2: {type: String, required: false},
    postalCode: {type: Number, required: true},
    city: {type: String, required: true},
    country: {type: String, required: false},
    state: {type: String, required: false}
});

module.exports = db.model('Address', address);