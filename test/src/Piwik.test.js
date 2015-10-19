"use strict";

import expect from "unexpected";
import * as DOM from "./../helpers/DOM";
import * as AssetsServer from "./../helpers/AssetsServer";
import { getVirtualConsole } from "jsdom";
import Piwik from "../../src/Piwik";

describe("Piwik", () => {
    const siteId = 99;
    let scripts, virtualConsole;

    before(() => DOM.create());
    before(() => {
        virtualConsole = getVirtualConsole(window);
        virtualConsole.on("jsdomError", (err) => {
            throw err;
        });
    });
    before(() => document.body.appendChild(document.createElement("script")));

    describe("init", () => {
        it("should return a reference to itself", () => {
            expect(Piwik.init(AssetsServer.piwikScriptUrl, siteId), "to equal", Piwik);
        });

        describe(".loadScript()", () => {

            before((done) => AssetsServer.start(done));
            before((done) => Piwik.loadScript().then(() => done()).catch((err) => done(err)));

            it("should have injected `piwik.js` before other scripts", () => {
                scripts = Array.from(document.getElementsByTagName("script"));
                expect(scripts, "to have length", 2);
                expect(scripts[0].src, "to equal", AssetsServer.piwikScriptUrl);
            });

            it("should have removed Piwik from global/window", () => {
               expect(window.Piwik, "to be undefined");
            });

            it("should store a Reference to previously global Piwik-Object (duck typing test)", () => {
                expect(Piwik.Piwik.getTracker, "to be a", "function");
                expect(Piwik.Piwik.getAsyncTracker, "to be a", "function");
                expect(Piwik.Piwik.addPlugin, "to be a", "function");
            });

            it("should extend Piwik with all tracker-methods (duck typing test)", () => {
                for (let methodName in Piwik.Piwik.getTracker()) {
                    expect(Piwik[methodName], "to be a", "function");
                }
            });

            after((done) => AssetsServer.stop(done));
        });
    });

    after(() => DOM.destroy());
});