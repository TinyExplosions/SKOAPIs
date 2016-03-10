// onHeaders allows us a listener to when headers are written (at response time)
var $fh = require('fh-mbaas-api'),
    Logger = require(__base + 'util/logger').getLogger(),
    onHeaders = require('on-headers');

module.exports = function responseTime(req, res, next) {

    // get start time of request
    var startAt = process.hrtime(),
        // get current path
        path = req.path;

    onHeaders(res, function onHeaders() {
        var diff = process.hrtime(startAt);
        // convert time to milliseconds
        var time = (diff[0] * 1e9 + diff[1]) / 1e6;

        // add path, and time taken to `$fh.stats`
        $fh.stats.timing("test", time);
        $fh.stats.inc("test");
        Logger.silly(path, 'returned in', time, 'ms');
    });
    // continue on with middleware execution
    next();

}