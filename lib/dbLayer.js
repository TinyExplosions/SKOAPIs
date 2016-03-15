var $fh = require('fh-mbaas-api'),
    events = require("events"),
    _ = require('underscore'),
    Logger = require(__base + 'util/logger').getLogger(),
    dbTableName = "SKODemo",
    util = require("util");


function DbLayer() {
    events.EventEmitter.call(this);
}
util.inherits(DbLayer, events.EventEmitter);

DbLayer.prototype.list = function list(cb) {
    var options = {
        "act": "list",
        "type": dbTableName
    };
    $fh.db(options, function(err, data) {
        if (err) {
            Logger.error("Error " + err);
            cb(err, null);
        } else {
            this.emit('list', data.list);
            cb(null, data.list);
        }
    });
};

DbLayer.prototype.add = function add(card, cb) {
    var options = {
        "act": "create",
        "type": dbTableName,
        "fields": card
    };
    $fh.db(options, function(err, data) {
        if (err) {
            Logger.error("Error " + err);
            cb(err, null);
        } else {
            this.emit('add', data);
            cb(null, data);
        }
    });
};

DbLayer.prototype.get = function add(id, cb) {
    var options = {
        "act": "read",
        "type": dbTableName,
        "guid": id
    };
    $fh.db(options, function(err, data) {
        if (err) {
            Logger.error("Error " + err);
            cb(err, null);
        } else {
            this.emit('get', data);
            cb(null, data);
        }
    });
};

DbLayer.prototype.delete = function remove(id, cb) {
    var options = {
        "act": "delete",
        "type": dbTableName,
        "guid": id
    };
    $fh.db(options, function(err, data) {
        if (err) {
            Logger.error("Error " + err);
            return cb(err, null);
        } else {
            this.emit('delete', data);
            return cb(null, data);
        }
    });
};

DbLayer.prototype.update = function update(card, cb) {
    var options = {
        "act": "read",
        "type": dbTableName,
        "guid": card.id
    };
    $fh.db(options, function(err, entity) {
        if (err) {
            Logger.error("Error " + err);
            return cb(err, null);
        } else {
            var entFields = entity.fields;
            entFields = _.extend(entFields, card);

            options = {
                "act": "update",
                "type": dbTableName,
                "guid": entFields.id,
                "fields": entFields
            };
            $fh.db(options, function(err, data) {
                if (err) {
                    Logger.error("Error " + err);
                    return cb(err, null);
                } else {
                    data.fields.id = data.guid;
                    this.emit('update', data.fields);
                    return cb(null, data.fields);
                }
            });
        }
    });

};

module.exports = new DbLayer();
