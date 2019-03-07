"use strict";
/**
 *
 * @param {String} url - absolute url to Piwik-script
 * @param {Function} onLoad
 * @param {function(Error|null)} onError
 * @returns {Node}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getPiwikScript = function getPiwikScript(url, onLoad, onError) {
  var script = document.createElement("script");

  var _onLoad = function _onLoad() {
    onLoad();
    script.onload = script.onreadystatechange = null;
    script.onerror = null;
  };

  var _onError = function _onError() {
    onError(new URIError("Failed to load ".concat(url, ".")) || null);
    script.onload = script.onreadystatechange = null;
    script.onerror = null;
  };

  script.type = "text/javascript";
  script.src = url;
  script.defer = true;
  script.async = true;
  script.onload = script.onreadystatechange = _onLoad;
  script.onerror = _onError;
  return script;
};

var _default = getPiwikScript;
exports.default = _default;