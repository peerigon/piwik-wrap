"use strict"; // import sinon from "sinon";

var AssetsServer = _interopRequireWildcard(require("./../helpers/AssetsServer"));

var _Piwik = _interopRequireDefault(require("../../Piwik"));

var _util = _interopRequireDefault(require("util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
    document.body.appendChild(document.createElement("script")); // console.log(JSON.stringify(document.body, null, 2));
  });
  describe("init", function () {
    it.only("should return a reference to itself", function () {
      console.log("hellooo");
      console.log(_util.default.inspect(document.body.innerHTML));
      expect(_Piwik.default.init(AssetsServer.host, siteId)).toEqual(_Piwik.default);
    });
    describe(".loadScript()", function () {
      // before((done) => AssetsServer.start(done));
      // before((done) => Piwik.loadScript().then(() => done()).catch((err) => done(err)));
      beforeAll(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(done) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  AssetsServer.start(function () {
                    _Piwik.default.loadScript().then(function () {
                      return done();
                    }).catch(function (err) {
                      return done(err);
                    });
                  });

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      it("should have injected `piwik.js` before other scripts", function () {
        scripts = Array.from(document.getElementsByTagName("script"));
        expect(scripts, "to have length", 2);
        expect(scripts[0].src, "to equal", AssetsServer.piwikScriptUrl);
      });
      it("should have removed Piwik from global/window", function () {
        expect(window.Piwik).toBeUndefined();
      });
      it("should store a Reference to previously global Piwik-Object (duck typing test)", function () {
        expect(_Piwik.default.Piwik.getTracker, "to be a", "function");
        expect(_Piwik.default.Piwik.getAsyncTracker, "to be a", "function");
        expect(_Piwik.default.Piwik.addPlugin, "to be a", "function");
      });
      it("should extend Piwik with all tracker-methods (duck typing test)", function () {
        for (var methodName in _Piwik.default.Piwik.getTracker()) {
          expect(_Piwik.default[methodName], "to be a", "function");
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
        _Piwik.default.spy = sinon.spy();

        _Piwik.default.expect = function () {
          expect(_Piwik.default.spy.callCount, "to be", 1);
          expect(_Piwik.default.spy.getCall(0).args, "to equal", args);
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