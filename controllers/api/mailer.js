var router = require('express').Router();
var config = require("../../config");

var queue = require('./../rabbitMQ');

/**
 * This API is set up for sending mails from our app
 * It requires params like:
 * @argument {String} from -recipient
 * @argument {String} subject email subject
 * @argument {String} content message html content
 */
router.post("/", function (req, res, next) {

    var mailOptions = {
        to: req.body.to || config.mail_settings.contact_mail,
        from: config.mail_settings.contact_mail,
        subject: req.body.subject,
        html: req.body.content,
        replyTo: req.body.replyTo
    };

    queue.publishMsg(JSON.stringify(mailOptions));
    return res.sendStatus(200);
});

module.exports = router;