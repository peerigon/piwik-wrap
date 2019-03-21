"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = _interopRequireDefault(require("util"));

var _Piwik = _interopRequireDefault(require("../../Piwik"));

var AssetsServer = _interopRequireWildcard(require("../helpers/AssetsServer"));

// import sinon from "sinon";
// import { getVirtualConsole } from "jsdom";
describe("Piwik", function () {
  var siteId = 99;
  var scripts; // before(() => DOM.create());
  // before(() => {
  //     virtualConsole = getVirtualConsole(window);
  //     virtualConsole.on("jsdomError", (err) => {
  //         throw err;
  //     });
  // });
  // before(() => document.body.appendChild(document.createElement("script")));

  beforeAll(function () {
    document.body.innerHTML = "\n            <div>\n                <p> Test Document </p>\n            </div>\n        ";
    document.body.appendChild(document.createElement("script")); // Kept here to show the trouble I had with console.logging the jsdom document.
    // console.log(util.inspect(document.body.innerHTML));
  });
  describe("init", function () {
    it("should return a reference to itself", function () {
      console.log("hellooo");
      expect(_Piwik.default.init(AssetsServer.host, siteId)).toEqual(_Piwik.default);
    });
    describe.only(".loadScript()", function () {
      beforeAll(
      /*#__PURE__*/
      (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return AssetsServer.start(function () {
                  _Piwik.default.loadScript();
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
      it("should have injected `piwik.js` before other scripts", function () {
        console.log(_util.default.inspect(document.body.innerHTML));
        scripts = Array.from(document.getElementsByTagName("script"));
        expect(scripts).toHaveLength(2);
        expect(scripts[0].src).toEqual(AssetsServer.piwikScriptUrl);
      });
      it.skip("should have removed Piwik from global/window", function () {
        expect(window.Piwik).toBeUndefined();
      });
      it.skip("should store a Reference to previously global Piwik-Object (duck typing test)", function () {
        expect((0, _typeof2.default)(_Piwik.default.Piwik.getTracker)).toBe("function");
        expect((0, _typeof2.default)(_Piwik.default.Piwik.getAsyncTracker)).toBe("function");
        expect((0, _typeof2.default)(_Piwik.default.Piwik.addPlugin)).toBe("function");
      });
      it.skip("should extend Piwik with all tracker-methods (duck typing test)", function () {
        for (var methodName in _Piwik.default.Piwik.getTracker()) {
          expect((0, _typeof2.default)(_Piwik.default[methodName])).toBe("function");
        }
      });
      it.skip("it should return a Promise if a tracker function was called", function (done) {
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
      it.skip("should expose a Promise via `p`-property", function (done) {
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
      afterAll(function (done) {
        _Piwik.default.restore();

        AssetsServer.stop(done);
      });
    });
    describe(".queue()", function () {
      beforeAll(function (done) {
        return AssetsServer.start(done);
      });
      beforeAll(function () {
        return _Piwik.default.init(AssetsServer.host, siteId);
      });
      it("should execute given function with passed arguments when Piwik had been loaded", function (done) {
        var args = [1, 2, 3];

        _Piwik.default.loadScript();

        _Piwik.default.queue("trackPageView").queue("trackSiteSearch", "keyword");

        _Piwik.default.queue("trackGoal", "trackGoal").queue("trackLink", "url", "linkType");

        _Piwik.default.queue.apply(_Piwik.default, ["spy"].concat(args)).queue("expect").queue("done");

        _Piwik.default.done = done; // ? what

        var spy = jest.spyOn(_Piwik.default, "spy");

        _Piwik.default.expect = function () {
          expect(spy.callCount, "to be", 1);
          expect(spy.getCall(0).args, "to equal", args);
        };
      });
      afterAll(function (done) {
        _Piwik.default.restore();

        AssetsServer.stop(done);
      });
    });
    describe(".p", function () {
      beforeAll(function (done) {
        return AssetsServer.start(done);
      });
      beforeAll(function () {
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
      afterAll(function (done) {
        _Piwik.default.restore();

        AssetsServer.stop(done);
      });
    });
  });
  afterAll(function () {
    return document.destroy();
  });
});