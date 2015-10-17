"use strict";

import { jsdom } from "jsdom";

export const create = (html) => {
    global.document = jsdom(html || "");
    global.window = document.defaultView;
    global.location = window.location;
    global.Element = window.Element;
    global.navigator = {
        userAgent: "node.js"
    };
};

export const destroy = () => {
    window.close();
    delete global.window;
    delete global.location;
    delete global.Element;
    delete global.navigator;
    delete global.document;
};