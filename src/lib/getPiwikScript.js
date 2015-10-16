"use strict";

import { resolve as urlResolve } from "url";

const getPiwikScript = (url, onLoad, onError) => {
    const script = document.createElement("script");
    const scriptUrl = urlResolve(url, "piwik.js");

    const _onLoad = () => {
        onLoad.call(this);
        script.onload = script.onreadystatechange = null;
        script.onerror = null;
    };

    const _onError = () => {
        onError(new URIError(`Failed to load ${scriptUrl}.`));
        script.onload = script.onreadystatechange = null;
        script.onerror = null;
    };

    script.type = "text/javascript";
    script.src = scriptUrl;
    script.defer = true;
    script.async = true;
    script.onload = script.onreadystatechange = _onLoad;
    script.onerror = _onError;

    return script;
};

export default getPiwikScript;