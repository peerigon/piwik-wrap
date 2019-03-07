"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _injectScript = _interopRequireDefault(require("./lib/injectScript"));

var _getPiwikScript = _interopRequireDefault(require("./lib/getPiwikScript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Piwik = {
  p: null,
  url: null,
  trackerURL: null,
  scriptURL: null,
  siteId: null,
  Piwik: null,
  Tracker: null,
  Queue: [],
  init: function init(url, siteId) {
    this.restore();
    this.url = url;
    this.trackerURL = "".concat(this.url, "/piwik.php");
    this.scriptURL = "".concat(this.url, "/piwik.js");
    this.siteId = siteId;
    return this;
  },
  loadScript: function loadScript() {
    var _this = this;

    this.p = new Promise(function (resolve, reject) {
      return (0, _injectScript.default)((0, _getPiwikScript.default)(_this.scriptURL, resolve, reject));
    });
    this.p.then(this._checkPiwikInitialization.bind(this));
    this.p.then(this._removePiwikFromWindow.bind(this));
    this.p.then(this._getTracker.bind(this));
    this.p.then(this._rewireTrackerFunctions.bind(this));
    return this.p;
  },
  queue: function queue(fn) {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.p.then(function () {
      var _this2$fn;

      (_this2$fn = _this2[fn]).call.apply(_this2$fn, [_this2.Tracker].concat(args));
    });
    return this;
  },
  restore: function restore() {
    for (var fn in this.Tracker) {
      if (this[fn]) delete this[fn];
    }

    this.p = null;
    this.url = null;
    this.siteId = null;
    this.Piwik = null;
    this.Tracker = null;
    this.Queue = [];
    return this;
  },
  _checkPiwikInitialization: function _checkPiwikInitialization() {
    if (!window.Piwik) {
      throw new Error("There was an Error while loading and initializing Piwik.");
    }
  },
  _removePiwikFromWindow: function _removePiwikFromWindow() {
    this.Piwik = window.Piwik;
    window.Piwik = undefined;
  },
  _getTracker: function _getTracker() {
    this.Tracker = this.Piwik.getTracker(this.trackerURL, this.siteId);
  },
  _rewireTrackerFunctions: function _rewireTrackerFunctions() {
    var _this3 = this;

    var _loop = function _loop(fn) {
      _this3[fn] = function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _this3.p.then(function () {
          return _this3.Tracker[fn].apply(_this3.Tracker, args);
        });
      };
    };

    for (var fn in this.Tracker) {
      _loop(fn);
    }
  }
};
var _default = Piwik;
exports.default = _default;