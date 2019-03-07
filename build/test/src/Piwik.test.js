"use strict";

var _unexpected = _interopRequireDefault(require("unexpected"));

var _sinon = _interopRequireDefault(require("sinon"));

var DOM = _interopRequireWildcard(require("./../helpers/DOM"));

var AssetsServer = _interopRequireWildcard(require("./../helpers/AssetsServer"));

var _jsdom = require("jsdom");

var _Piwik = _interopRequireDefault(require("../../Piwik"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Piwik", function () {
  var siteId = 99;
  var scripts, virtualConsole;
  before(function () {
    return DOM.create();
  });
  before(function () {
    virtualConsole = (0, _jsdom.getVirtualConsole)(window);
    virtualConsole.on("jsdomError", function (err) {
      throw err;
    });
  });
  before(function () {
    return document.body.appendChild(document.createElement("script"));
  });
  describe("init", function () {
    it("should return a reference to itself", function () {
      console.log("hellooo");
      (0, _unexpected.default)(_Piwik.default.init(AssetsServer.host, siteId), "to equal", _Piwik.default);
    });
    describe(".loadScript()", function () {
      before(function (done) {
        return AssetsServer.start(done);
      });
      before(function (done) {
        return _Piwik.default.loadScript().then(function () {
          return done();
        }).catch(function (err) {
          return done(err);
        });
      });
      it("should have injected `piwik.js` before other scripts", function () {
        scripts = Array.from(document.getElementsByTagName("script"));
        (0, _unexpected.default)(scripts, "to have length", 2);
        (0, _unexpected.default)(scripts[0].src, "to equal", AssetsServer.piwikScriptUrl);
      });
      it("should have removed Piwik from global/window", function () {
        (0, _unexpected.default)(window.Piwik, "to be undefined");
      });
      it("should store a Reference to previously global Piwik-Object (duck typing test)", function () {
        (0, _unexpected.default)(_Piwik.default.Piwik.getTracker, "to be a", "function");
        (0, _unexpected.default)(_Piwik.default.Piwik.getAsyncTracker, "to be a", "function");
        (0, _unexpected.default)(_Piwik.default.Piwik.addPlugin, "to be a", "function");
      });
      it("should extend Piwik with all tracker-methods (duck typing test)", function () {
        for (var methodName in _Piwik.default.Piwik.getTracker()) {
          (0, _unexpected.default)(_Piwik.default[methodName], "to be a", "function");
        }
      });
      it("it should return a Promise if a tracker function was called", function (done) {
        _Piwik.default.trackEvent("category", "action").then(function () {
          return _Piwik.default.trackPageView();
        }).then(function () {
          return _Piwik.default.trackSiteSearch("keyword");
        }).then(function () {
          return _Piwik.default.trackGoal("trackGoal");
        }).then(function () {
          return _Piwik.default.trackLink("url", "linkType");
        }) // ... and so on
        .then(function () {
          return done();
        }).catch(function (err) {
          return done(err);
        });
      });
      it("should expose a Promise via `p`-property", function (done) {
        _Piwik.default.p.then(function () {
          return _Piwik.default.setDocumentTitle("title");
        }).then(function () {
          return _Piwik.default.setCustomUrl("http://custom.url");
        });

        _Piwik.default.p.then(function () {
          return done();
        }).catch(function (err) {
          return done(err);
        });
      });
      after(function () {
        return _Piwik.default.restore();
      });
      after(function (done) {
        return AssetsServer.stop(done);
      });
    });
    describe(".queue()", function () {
      before(function (done) {
        return AssetsServer.start(done);
      });
      before(function () {
        return _Piwik.default.init(AssetsServer.host, siteId);
      });
      it("should execute given function with passed arguments when Piwik had been loaded", function (done) {
        var args = [1, 2, 3];

        _Piwik.default.loadScript();

        _Piwik.default.queue("trackPageView").queue("trackSiteSearch", "keyword");

        _Piwik.default.queue("trackGoal", "trackGoal").queue("trackLink", "url", "linkType");

        _Piwik.default.queue.apply(_Piwik.default, ["spy"].concat(args)).queue("expect").queue("done");

        _Piwik.default.done = done;
        _Piwik.default.spy = _sinon.default.spy();

        _Piwik.default.expect = function () {
          (0, _unexpected.default)(_Piwik.default.spy.callCount, "to be", 1);
          (0, _unexpected.default)(_Piwik.default.spy.getCall(0).args, "to equal", args);
        };
      });
      after(function () {
        return _Piwik.default.restore();
      });
      after(function (done) {
        return AssetsServer.stop(done);
      });
    });
    describe(".p", function () {
      before(function (done) {
        return AssetsServer.start(done);
      });
      before(function () {
        return _Piwik.default.init(AssetsServer.host, siteId);
      });
      it("should be possible to use Piwik Tracking Client methods through .then before .loadScript has finished", function (done) {
        _Piwik.default.loadScript();

        _Piwik.default.p.then(function () {
          return _Piwik.default.setDocumentTitle("title");
        }).then(function () {
          return _Piwik.default.setCustomUrl("http://another.custom.url");
        }).then(function () {
          return _Piwik.default.trackPageView();
        }).then(function () {
          return done();
        }).catch(function (err) {
          return err;
        });
      });
      after(function () {
        return _Piwik.default.restore();
      });
      after(function (done) {
        return AssetsServer.stop(done);
      });
    });
  });
  after(function () {
    return DOM.destroy();
  });
});