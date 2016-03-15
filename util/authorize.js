// Check for an `Authorization: Bearer` with a valid JSON Web Token
var Logger = require(__base + 'util/logger').getLogger(),
    jwt = require('jsonwebtoken');

module.exports = function authorizationMiddleware(req, res, next) {
    // Check if header exists, and is correct type
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        Logger.silly("in authorize Middleware, checking tokens");
        // make sure downstream middleware doesn't miss anything
        req.pause();
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SALT, function(err, decoded) {
            req.resume();
            // if `err` isn't null, something went wrong so return 401
            if (err) {
                Logger.error("JWT ERROR", JSON.stringify(err))
                return res.status(401).send(err.message);
            } else {
              // set `req.auth` to the decoded token, and continue processing middleware
              req.auth = decoded;
              return next();
            }
        });
    } else {
        // Header doesn;t exist, or is in wrong format, so return a 401
        return res.status(401).send("No Token Present");
    }

}
