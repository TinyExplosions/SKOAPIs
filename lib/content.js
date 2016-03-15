var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require(__base + '/lib/dbLayer');

function apiRoutes() {
  var app = new express.Router();
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', function(req, res) {
    db.list(function(err, items) {
      return res.send(items);
    });
  });

  app.post('/', function(req, res) {
    db.add(req.body, function(err, item) {
      if (err) {
        res.status(err);
        return res.send(item);
      } else {
        return res.send(item);
      }
    });
  });
  app.get('/:id', function(req, res) {
    db.get(req.params.id, function(err, item) {
      if (err) {
        res.status(err);
        return res.send(item);
      } else {
        return res.send(item);
      }
    });
  });
  app.put('/:id', function(req, res) {
    db.update(req.body, function(err, item) {
      if (err) {
        res.status(err);
        return res.send(item);
      } else {
        return res.send(item);
      }
    });
  });
  app.delete('/:id', function(req, res) {
    db.delete(req.params.id, function(err, item) {
      if (err) {
        res.status(err);
        return res.send(item);
      } else {
        return res.send(item);
      }
    });
  });

  return app;

}

module.exports = apiRoutes;