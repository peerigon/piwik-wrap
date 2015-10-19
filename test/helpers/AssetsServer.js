"use strict";

import path from "path";
import express from "express";

let server;

export const port = 3033;

export const host = `http://127.0.0.1:${port}`;

export const piwikScriptUrl = `${host}/assets/piwik.js`;;

export const start = (done) => {
    server = express();
    server.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
    server.get("*", (req, res) => res.status(404).send("Not Found"));
    server = server.listen(port, done);
};

export const stop = (done) => server.close(done);