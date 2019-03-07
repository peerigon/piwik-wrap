"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroy = exports.create = void 0;

var _jsdom = require("jsdom");

var create = function create(html) {
  global.document = (0, _jsdom.jsdom)(html || "");
  global.window = document.defaultView;
  global.location = window.location;
  global.Element = window.Element;
  global.navigator = {
    userAgent: "node.js"
  };
};

exports.create = create;

var destroy = function destroy() {
  window.close();
  delete global.window;
  delete global.location;
  delete global.Element;
  delete global.navigator;
  delete global.document;
};

exports.destroy = destroy;