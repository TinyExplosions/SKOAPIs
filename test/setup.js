// global gives us a `base` dir to avoid `./../../` hell
global.__base = './../';
process.env.JWT_SALT = 'top secret salt boi';

var express = require('express'),
    mbaasApi = require('fh-mbaas-api'),
    mbaasExpress = mbaasApi.mbaasExpress(),
    bodyParser = require('body-parser'),
    Logger = require(__base + 'util/logger'),
    server,
    port = 8052,
    app = express();

app.use(bodyParser());
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);
app.use(mbaasExpress.fhmiddleware());
app.use('/login', require(__base + 'lib/authenticate.js')());

app.use(mbaasExpress.errorHandler());

before(function(next) {
    server = app.listen(port, function() {
        Logger.setLoggerLevel('verbose', function() {
            Logger.setLoggerLevel({
                level: 'silly'
            }, function() {});
        });
        Logger.killLoggingForTests();
        next();
    });
});

after(function() {
    mbaasApi.db({
        "act": "close"
    }, function(err) {
        if (server) {
            server.close(function() {
                console.log("Server Closed");
            });
        }
    });
});
