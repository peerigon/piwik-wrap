"use strict";

var DOM = _interopRequireWildcard(require("../../helpers/DOM"));

var AssetsServer = _interopRequireWildcard(require("../../helpers/AssetsServer"));

var _getPiwikScript = _interopRequireDefault(require("../../../lib/getPiwikScript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

describe("getPiwikScript", function () {
  var script;
  before(function () {
    return DOM.create();
  });
  describe("script properties:", function () {
    before(function () {
      return script = (0, _getPiwikScript.default)(AssetsServer.piwikScriptUrl, function () {}, function () {});
    });
    describe("type", function () {
      it("should have a property type with value \"text/javascript\"", function () {
        expect(script, "to have property", "type");
        expect(script.type, "to equal", "text/javascript");
      });
    });
    describe("defer", function () {
      it("should have a property defer set to true", function () {
        expect(script, "to have property", "defer");
        expect(script.defer, "to be truthy");
      });
    });
    describe("async", function () {
      it("should have a property async set to true", function () {
        expect(script, "to have property", "async");
        expect(script.async, "to be truthy");
      });
    });
  });
  describe("script callbacks", function () {
    before(function (done) {
      return AssetsServer.start(done);
    });
    describe("onload", function () {
      it("should execute given callback \"onload\"", function (done) {
        document.body.appendChild((0, _getPiwikScript.default)(AssetsServer.piwikScriptUrl, done, done));
      });
    });
    describe("onerror", function () {
      it("should execute given callback \"onerror\" and pass an instance of URIError", function (done) {
        document.body.appendChild((0, _getPiwikScript.default)(AssetsServer.piwikScriptUrl.replace(":".concat(AssetsServer.port), ""), function () {
          return done(new Error("Test Failed!"));
        }, function (err) {
          expect(err, "to be a", URIError);
          done();
        }));
      });
    });
    after(function (done) {
      return AssetsServer.stop(done);
    });
  });
  after(function () {
    return DOM.destroy();
  });
});