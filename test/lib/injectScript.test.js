"use strict";

import expect from "unexpected";
import * as DOM from "../helpers/DOM";

import injectScript from "../../src/lib/injectScript";

describe("injectScript", () => {
    let script, scripts;

    before(() => DOM.create());
    before(() => document.body.appendChild(document.createElement("script")));
    before(() => script = document.createElement("script"));

    it("should inject a passed script before existing scripts", () => {
        injectScript(script);

        scripts = Array.from(document.getElementsByTagName("script"));

        expect(scripts, "to have length", 2);
        expect(scripts[0], "to equal", script);
    });

    after(() => DOM.destroy());
});