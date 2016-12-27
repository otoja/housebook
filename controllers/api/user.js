var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User = require('../../model/user');
var config = require('../../config');

router.get('/', function (req, res, next) {

    if (!req.headers['x-auth'] || !req.headers['x-auth'].length) {
        console.log("Missing token");
        return res.sendStatus(401);
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    console.log("jwt decode");

    User.findOne({username: auth.username})
            .populate({path: 'createdHouseProfile.ref'})
            
            .exec(function (err, user) {
                if (err)
                    return next(err);
                res.json(user);
            });
});

router.post('/', function (req, res, next) {
    console.log("create new user with username: " + req.body.username);
    var user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        needToChangePassword: false,
        expire: new Date,
        roles: ['User']
    });

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        user.password = hash;
        console.log("Encrypted password: " + hash);
        user.save(function (err) {
            console.log("save method");
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("created");
            return res.sendStatus(201);
        });
    });
});

module.exports = router;