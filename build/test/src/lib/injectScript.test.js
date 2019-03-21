"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var DOM = _interopRequireWildcard(require("../../helpers/DOM"));

var _injectScript = _interopRequireDefault(require("../../../lib/injectScript"));

describe("injectScript", function () {
  var script, scripts;
  before(function () {
    return DOM.create();
  });
  before(function () {
    return document.body.appendChild(document.createElement("script"));
  });
  before(function () {
    return script = document.createElement("script");
  });
  it("should inject a passed script before existing scripts", function () {
    (0, _injectScript.default)(script);
    scripts = Array.from(document.getElementsByTagName("script"));
    expect(scripts, "to have length", 2);
    expect(scripts[0], "to equal", script);
  });
  after(function () {
    return DOM.destroy();
  });
});