"use strict";

import injectScript from "./lib/injectScript";
import getPiwikScript from "./lib/getPiwikScript";


const Piwik = {

    p: null,

    url: null,

    siteId: null,

    Piwik: null,

    init(url, siteId) {
        this.url = url;
        this.siteId = siteId;
        return this;
    },

    loadScript() {
        this.p = new Promise((resolve, reject) => injectScript(getPiwikScript(this.url, resolve, reject)));
        this.p.then(this._checkPiwikInitialization.bind(this));
        this.p.then(this._removePiwikFromWindow.bind(this));
        this.p.then(this._swallowPiwikMethods.bind(this));

        return this.p;
    },

    _checkPiwikInitialization() {
        if (!window.Piwik) {
            throw new Error("There was an Error while loading and initializing Piwik.");
        }
    },

    _removePiwikFromWindow() {
        this.Piwik = window.Piwik;
        window.Piwik = undefined;
    },

    _swallowPiwikMethods() {
        const tracker = this.Piwik.getTracker(this.url, this.siteId);
        const self = this;

        for (let methodName in tracker) {
            self[methodName] = (...args) => {
                return self.p
            }
        }
    }

};

export default Piwik;