"use strict";

import path from "path";
import express from "express";

let server;

export const start = (port, done) => {
    server = express();
    server.get("/test", (req, res) => res.end("Test Server"));
    server.get("*", (req, res) => res.status(404).send("Not Found"));
    server.get("/piwik.js", express.static(path.resolve(__dirname, "..", "assets/piwik.js")));
    server = server.listen(port, done);
};

export const stop = (done) => {
    server.close(done);
};