"use strict";

import injectScript from "./lib/injectScript";
import getPiwikScript from "./lib/getPiwikScript";


const Piwik = {

    p: null,

    url: null,

    siteId: null,

    Piwik: null,

    Tracker: null,

    _queue: [],

    init(url, siteId) {
        this.url = url;
        this.siteId = siteId;
        return this;
    },

    loadScript() {
        this.p = new Promise((resolve, reject) => injectScript(getPiwikScript(this.url, resolve, reject)));
        this.p.then(this._checkPiwikInitialization.bind(this));
        this.p.then(this._removePiwikFromWindow.bind(this));
        this.p.then(this._init.bind(this));
        this.p.then(this._rewireTrackerFunctions.bind(this));
        this.p.then(this._execQueue.bind(this));

        return this.p;
    },

    exec(fn, ...args) {
        if (typeof this[fn] === "function") {
            this.p.then(() => this[fn].call(this.Tracker, ...args));
        } else {
            this.queue.push({fn: fn, args: args})
        }

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

    _init() {
        this.Tracker = this.Piwik.getTracker(this.url, this.siteId);
    },

    _rewireTrackerFunctions() {
        for (let fn in this.Tracker) {
            this[fn] = (...args) => this.p.then(() => this.Tracker[fn].apply(this.Tracker, args));
        }
    },

    _execQueue() {
        this._queue.forEach((fnArgs) => {
           this.exec(fnArgs.fn, ...fnArgs.args);
        });
    }

};

export default Piwik;