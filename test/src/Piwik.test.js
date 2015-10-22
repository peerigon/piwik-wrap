"use strict";

import expect from "unexpected";
import sinon from "sinon";
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

            it("it should return a Promise if a tracker function was called", (done) => {
                Piwik
                    .trackEvent("category", "action")
                    .then(() => Piwik.trackPageView())
                    .then(() => Piwik.trackSiteSearch("keyword"))
                    .then(() => Piwik.trackGoal("trackGoal"))
                    .then(() => Piwik.trackLink("url", "linkType"))
                    // ... and so on
                    .then(() => done())
                    .catch((err) => done(err));
            });

            after(() => Piwik.restore());
            after((done) => AssetsServer.stop(done));
        });

        describe(".queue()", () => {

            before((done) => AssetsServer.start(done));
            before(() => Piwik.init(AssetsServer.piwikScriptUrl, siteId));

            it("should execute given function with passed arguments when Piwik had been loaded", (done) => {
                const args = [1, 2, 3];

                Piwik
                    .queue("trackPageView")
                    .queue("trackSiteSearch", "keyword");

                Piwik
                    .queue("trackGoal", "trackGoal")
                    .queue("trackLink", "url", "linkType");

                Piwik.queue("spy", ...args);

                Piwik
                    .loadScript()
                    .then(() => {
                        expect(Piwik.spy.callCount, "to be", 1);
                        expect(Piwik.spy.getCall(0).args, "to equal", args);
                    })
                    .then(() => Piwik.queue("done"))
                    .catch((err) => done(err));

                Piwik.done = done;
                Piwik.spy = sinon.spy();
            });

            after(() => Piwik.restore());
            after((done) => AssetsServer.stop(done));
        });
    });

    after(() => DOM.destroy());
});