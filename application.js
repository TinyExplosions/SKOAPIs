// global gives us a `base` dir to avoid `./../../` hell
global.__base = __dirname + '/';

var $fh = require('fh-mbaas-api'),
    express = require('express'),
    mbaasExpress = $fh.mbaasExpress(),
    cors = require('cors'),
    securableEndpoints,
    serveStatic = require('serve-static'),
    jwt = require('express-jwt'),
    Logger = require(__base + 'util/logger').getLogger(),
    Cache = require(__base + 'util/cache'),
    Timer = require(__base + 'util/timer'),
    Authorize = require(__base + 'util/authorize'),
    app = express();

// list the endpoints which you want to make securable here
securableEndpoints = ['/hello'];

// serve the `docs` dir to view annotated source (generated by `grunt document`),
// By default this route is only active when you run locally
if (!process.env.FH_ENV) {
    app.use('/docs', serveStatic(__dirname + '/docs', { 'index': ['index.html', 'application.html'] }));
    app.use('/coverage', serveStatic(__dirname + '/coverage', { 'index': ['index.html', 'coverage.html'] }));
}

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/login', require('./lib/authenticate.js')());
app.use(Authorize);
// use our cache middleware for any routes below it
app.use(Timer);
app.use(Cache);

app.use('/content', require('./lib/content.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

// Setup the various ports etc and actually get the application to run.
var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
    Logger.info("App started at: " + new Date() + " on port: " + port);
});
