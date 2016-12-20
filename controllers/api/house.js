var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var filessystem = require('fs');
var ObjectId = require('mongodb').ObjectID;
var config = require('../../config');


var House = require('../../model/house');
var Address = require('../../model/address');
var User = require('../../model/user');

router.get('/:profileId', function (req, res, next) {
    if (!req.headers['x-auth']) {
        console.log("Missing token");
        return res.sendStatus(401);
    }
    console.log("req.params.profileId " + req.params.profileId);
    House.findOne({"_id": ObjectId(req.params.profileId)})
            .populate({path: 'createdBy'})
            .populate({path: 'inhabitants'})
            .exec(function (err, house) {
                if (err) {
                    return next(err);
                } else {
                    return res.json(house);
                }
            });
});

router.post('/:profileId', function (req, res, next) {
    if (!req.headers['x-auth']) {
        console.log("Missing token");
        return res.sendStatus(401);
    }
    console.log(req.params.profileId);

    House.findOne({"_id": ObjectId(req.params.profileId)}).exec(function (err, house) {
        if (err)
            return next(err);

        if (req.body.thumbnail && req.body.thumbnail.length) {
            saveThumbnail(req.params.profileId, req.body.thumbnail);
        }

        return res.sendStatus(201);
    });
});

router.post('/', function (req, res, next) {
    if (!req.headers['x-auth']) {
        console.log("Missing token");
        return res.sendStatus(401);
    }

    var auth = jwt.decode(req.headers['x-auth'], config.secret);

    var address = new Address({
        street1: req.body.street1,
        street2: req.body.street2,
        postalCode: req.body.postCode,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
    });

    console.log(JSON.stringify(address));

    var house = new House({
        name: req.body.name,
        createdBy: req.body.createdBy,
        builtYear: req.body.buildYear,
        movedInYear: req.body.movedInYear,
        address: address
    });

    console.log(JSON.stringify(house));
    User.findOne({username: auth.username}).exec(function (err, user) {
        house.createdBy = user._id;
        house.save(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }

            User.findOne({"_id": ObjectId(house.createdBy)}).exec(function (err, user) {
                user.createdHouseProfile.push({ref: house._id, name: house.name, thumbnail: 'test'});
                user.save();
            });

            return res.send(house._id);
        });
    });
});



function saveThumbnail(profileId, data) {
    var base64Data = data.replace(/^data:image\/png;base64,/, "");
    var dir = __dirname + '/../../uploads/' + profileId;
    console.log(dir);
    if (!filessystem.existsSync(dir)) {
        filessystem.mkdirSync(dir);
    }

    filessystem.writeFile(dir + '/thumbnail.png', base64Data, 'base64', function (err) {
        console.log(err);
    });
}

module.exports = router;