var router = require('express').Router();
var config = require("../../config");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/**
 * This API is set up for sending mails from our app
 * It requires params like:
 * @argument {String} from -recipient
 * @argument {String} subject email subject
 * @argument {String} content message html content
 */
router.post("/", function (req, res, next) {
    var mailOptions = {
        to: config.mail_settings.contact_mail,
        from: config.mail_settings.contact_mail,
        subject: req.body.subject,
        html: req.body.content,
        replyTo: req.body.replyTo
    };

    var transportOptions = {
        host: config.mail_settings.smpt_server,
        port: config.mail_settings.port,
        auth: {
            user: config.mail_settings.username,
            pass: config.mail_settings.password
        },
        secure: false,
        ignoreTLS: true,
        debug: true,
        logger: true
    };

    var transporter = nodemailer.createTransport(transportOptions);

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return next(err);
        }

        console.log('Message sent: ' + info.response);
        return res.send(info.response);
    });
});

module.exports = router;