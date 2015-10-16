"use strict";

import injectScript from "./lib/injectScript";
import getPiwikScript from "./lib/getPiwikScript";

module.exports = {

    _p: null,

    init (url, siteId) {
        this._p = new Promise((resolve, reject) => {
            injectScript(getPiwikScript(url, resolve, reject));
        })
        .then(() => {
            return window.Piwik.getTracker(url, siteId);
        })
        .error(console.error) ;
    },

    trackPageView(customTitle) {
        this._p.then((piwik) => {
            piwik.trackPageView(customTitle);
        });

        return this;
    }

};