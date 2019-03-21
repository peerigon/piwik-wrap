// import sinon from "sinon";
import util from "util";
import Piwik from "../../Piwik";
import * as AssetsServer from "../helpers/AssetsServer";
// import { getVirtualConsole } from "jsdom";

describe("Piwik", () => {
    const siteId = 99;
    let scripts;

    // before(() => DOM.create());
    // before(() => {
    //     virtualConsole = getVirtualConsole(window);
    //     virtualConsole.on("jsdomError", (err) => {
    //         throw err;
    //     });
    // });
    // before(() => document.body.appendChild(document.createElement("script")));

    beforeAll(() => {
        document.body.innerHTML = `
            <div>
                <p> Test Document </p>
            </div>
        `;
        document.body.appendChild(document.createElement("script"));
        // Kept here to show the trouble I had with console.logging the jsdom document.
        // console.log(util.inspect(document.body.innerHTML));
    });

    describe("init", () => {
        it("should return a reference to itself", () => {
            console.log("hellooo");
            expect(Piwik.init(AssetsServer.host, siteId)).toEqual(Piwik);
        });

        describe.only(".loadScript()", () => {
            beforeAll(async () => {
                await AssetsServer.start(() => {
                    Piwik.loadScript();
                });
            });

            it("should have injected `piwik.js` before other scripts", () => {
                // console.log(util.inspect(document.body.innerHTML));
                scripts = Array.from(document.getElementsByTagName("script"));
                expect(scripts).toHaveLength(2);
                expect(scripts[0].src).toEqual(AssetsServer.piwikScriptUrl);
            });

            it.skip("should have removed Piwik from global/window", () => {
                expect(window.Piwik).toBeUndefined();
            });

            it.skip("should store a Reference to previously global Piwik-Object (duck typing test)", () => {
                expect(typeof Piwik.Piwik.getTracker).toBe("function");
                expect(typeof Piwik.Piwik.getAsyncTracker).toBe("function");
                expect(typeof Piwik.Piwik.addPlugin).toBe("function");
            });

            it.skip("should extend Piwik with all tracker-methods (duck typing test)", () => {
                for (const methodName in Piwik.Piwik.getTracker()) {
                    expect(typeof Piwik[methodName]).toBe("function");
                }
            });

            it.skip("it should return a Promise if a tracker function was called", done => {
                Piwik
                    .trackEvent("category", "action")
                    .then(() => Piwik.trackPageView())
                    .then(() => Piwik.trackSiteSearch("keyword"))
                    .then(() => Piwik.trackGoal("trackGoal"))
                    .then(() => Piwik.trackLink("url", "linkType"))
                    // ... and so on
                    .then(() => done())
                    .catch(err => done(err));
            });

            it.skip("should expose a Promise via `p`-property", done => {
                Piwik.p
                    .then(() => Piwik.setDocumentTitle("title"))
                    .then(() => Piwik.setCustomUrl("http://custom.url"));

                Piwik.p
                    .then(() => done())
                    .catch(err => done(err));
            });

            afterAll(done => {
                Piwik.restore();
                AssetsServer.stop(done);
            });
        });

        describe(".queue()", () => {
            beforeAll(done => AssetsServer.start(done));
            beforeAll(() => Piwik.init(AssetsServer.host, siteId));

            it("should execute given function with passed arguments when Piwik had been loaded", done => {
                const args = [1, 2, 3];

                Piwik.loadScript();

                Piwik
                    .queue("trackPageView")
                    .queue("trackSiteSearch", "keyword");

                Piwik
                    .queue("trackGoal", "trackGoal")
                    .queue("trackLink", "url", "linkType");

                Piwik
                    .queue("spy", ...args)
                    .queue("expect")
                    .queue("done");

                Piwik.done = done; // ? what
                const spy = jest.spyOn(Piwik, "spy");

                Piwik.expect = () => {
                    expect(spy.callCount, "to be", 1);
                    expect(spy.getCall(0).args, "to equal", args);
                };
            });

            afterAll(done => {
                Piwik.restore();
                AssetsServer.stop(done);
            });
        });

        describe(".p", () => {
            beforeAll(done => AssetsServer.start(done));
            beforeAll(() => Piwik.init(AssetsServer.host, siteId));

            it("should be possible to use Piwik Tracking Client methods through .then before .loadScript has finished", done => {
                Piwik.loadScript();

                Piwik.p
                    .then(() => Piwik.setDocumentTitle("title"))
                    .then(() => Piwik.setCustomUrl("http://another.custom.url"))
                    .then(() => Piwik.trackPageView())
                    .then(() => done())
                    .catch(err => err);
            });

            afterAll(done => {
                Piwik.restore();
                AssetsServer.stop(done);
            });
        });
    });

    afterAll(() => document.destroy());
});
