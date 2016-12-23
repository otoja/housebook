var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/housebook');
mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose;