"use strict";

import injectScript from "./lib/injectScript";
import getPiwikScript from "./lib/getPiwikScript";


const Piwik = {

    p: null,

    url: null,

    siteId: null,

    Piwik: null,

    Tracker: null,

    Queue: [],

    init(url, siteId) {
        this.restore();

        this.url = url;
        this.siteId = siteId;

        return this;
    },

    loadScript() {
        this.p = new Promise((resolve, reject) => injectScript(getPiwikScript(this.url, resolve, reject)));
        this.p.then(this._checkPiwikInitialization.bind(this));
        this.p.then(this._removePiwikFromWindow.bind(this));
        this.p.then(this._getTracker.bind(this));
        this.p.then(this._rewireTrackerFunctions.bind(this));
        this.p.then(this._execQueue.bind(this));

        return this.p;
    },

    queue(fn, ...args) {
        const loadScriptCalled = this.p instanceof Promise;
        const hasFn = typeof this[fn] === "function";

        if (loadScriptCalled && hasFn) {
            this[fn].apply(this.Tracker, ...args);
        } else {
            this.Queue.push({fn: fn, args: args});
        }

        return this;
    },

    restore() {
        for (let fn in this.Tracker) {
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

    _checkPiwikInitialization() {
        if (!window.Piwik) {
            throw new Error("There was an Error while loading and initializing Piwik.");
        }
    },

    _removePiwikFromWindow() {
        this.Piwik = window.Piwik;
        window.Piwik = undefined;
    },

    _getTracker() {
        this.Tracker = this.Piwik.getTracker(this.url, this.siteId);
    },

    _rewireTrackerFunctions() {
        for (let fn in this.Tracker) {
            this[fn] = (...args) => this.p.then(() => this.Tracker[fn].apply(this.Tracker, args));
        }
    },

    _execQueue() {
        this.Queue.forEach((fnArgs) => {
            const { fn, args } = fnArgs;
            this.queue(fn, args);
        }, this);

        this.Queue = [];
    }

};

export default Piwik;