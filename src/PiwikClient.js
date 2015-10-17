"use strict";

import injectScript from "./lib/injectScript";
import getPiwikScript from "./lib/getPiwikScript";

class PiwikClient {

    constructor(url, siteId) {
        this._script = getPiwikScript(url, resolve, reject);
        this._p = new Promise((resolve, reject) => injectScript(this._script))
        .then(() => window.Piwik.getTracker(url, siteId))
        .error(console.error) ;
    }

    trackPageView(customTitle) {
        return this._p.then((piwik) => piwik.trackPageView(customTitle));
    }

    enableLinkTracking(enable) {
        return this._p.then((piwik) => piwik.enableLinkTracking(enable));
    }

    enableHeartBeatTimer(delayInSeconds) {
        return this._p.then((piwik) => piwik.enableHeartBeatTimer(delayInSeconds));
    }

}

export default PiwikClient;