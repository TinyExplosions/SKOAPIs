var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Logger = require(__base + 'util/logger').getLogger(),
    jwt = require('jsonwebtoken'),
    emailValidator = require("email-validator"),
    EXPIRY_TIME = process.env.EXPIRY_TIME || "5m";

function authenticateRoute() {
    var app = express();
    app.use(cors());
    app.use(bodyParser());

    // a `POST` route, for generating a JWT
    app.post('/', function(req, res) {
        var email = req.body && req.body.email ? req.body.email : null;
        if(!email || !emailValidator.validate(email)) {
          // if params are invalid, return 400 (this is similar to GitHub)
          res.status(400);
          return res.send("Invalid Params");
        }

        // create the toke, using the `JWT_SALT` environment variable, setting a low expiry time
        // for demonstration purposes (can be overwritten with `EXPIRY_TIME` environment variable)
        var token = jwt.sign({ foo: 'bar' }, process.env.JWT_SALT, {expiresIn: EXPIRY_TIME});
        // return the generated token.
        res.send(token);
    });

    return app;
}

module.exports = authenticateRoute;