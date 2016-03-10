// Simple caching middleware that looks for a cached response and returns it if it exists
var $fh = require('fh-mbaas-api'),
    Logger = require(__base + 'util/logger').getLogger();

(function() {

    function cacheMiddleware(req, res, next) {
        Logger.silly("in cache Middleware, path is:", req.path);
        // make sure downstream middleware doesn't miss anything
        req.pause();
        // use `$fh.hash` to get a hash of the path as a cache key
        $fh.hash({
            "algorithm": 'MD5',
            "text": req.path
        }, function(err, result) {
            req.resume();
            if (err) {
                // if there's any errors, just pass to the next middleware, don't need to throw an error
                next();
            } else {
                Logger.silly("Hashed path is:", result.hashvalue);
                // Load the hashed value from the cache
                var cacheOptions = {
                    "act": "load",
                    "key": result.hashvalue
                };
                req.pause();
                $fh.cache(cacheOptions, function(err, cachedResult) {
                    req.resume();
                    if (err) {
                      // again, errors we can ignore and just go to next middleware
                      next();
                    // if `cachedResult` is null, we've nothing in the cache
                    } else if (cachedResult !== null) {
                      Logger.silly("cached response is:",cachedResult);
                      // we've a cached response, so send that
                      res.send(JSON.parse(cachedResult));
                    } else {
                      next();
                    }
                });
            }
        });
    }

    module.exports = cacheMiddleware;

}());
