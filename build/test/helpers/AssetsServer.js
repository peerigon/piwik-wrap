"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.start = exports.piwikScriptUrl = exports.host = exports.port = void 0;

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var server;
var port = 3033;
exports.port = port;
var host = "http://127.0.0.1:".concat(port);
exports.host = host;
var piwikScriptUrl = "".concat(host, "/piwik.js");
exports.piwikScriptUrl = piwikScriptUrl;

var start = function start(done) {
  server = (0, _express.default)();
  server.use("/", _express.default.static(_path.default.resolve(__dirname, "..", "assets")));
  server.get("*", function (req, res) {
    return res.status(404).send("Not Found");
  });
  server = server.listen(port, done);
};

exports.start = start;

var stop = function stop(done) {
  return server.close(done);
};

exports.stop = stop;