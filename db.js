var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/housebook');

module.exports = mongoose;