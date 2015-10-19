"use strict";

/**
 *
 * @param {String} url - absolute url to Piwik-script
 * @param {Function} onLoad
 * @param {function(Error|null)} onError
 * @returns {Node}
 */
const getPiwikScript = (url, onLoad, onError) => {
    const script = document.createElement("script");

    const _onLoad = () => {
        onLoad();
        script.onload = script.onreadystatechange = null;
        script.onerror = null;
    };

    const _onError = () => {
        onError(new URIError(`Failed to load ${url}.`) || null);
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

export default getPiwikScript;