# piwik-wrap

**A Promise-based wrapper for the Piwik JavaScript Tracking Client providing an enjoyable API**

piwik-wrap wraps the Piwik [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript) and
provides an easy to use API for non- and Single Page Applications without polluting global namespace.
All [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript) methods are directly 
accessible through piwik-wrap.

## usage

```javascript
// page entry js/client bootstrapping

import Piwik from "piwik-wrap";

// ... more imports and declarations

const siteId = 1;

// ... some other client bootstrapping code

// example 1

Piwik
    .init("https://my.piwik-instance.com", siteId);
    .loadScript()
    .then(() => Piwik.trackPageView());
    
// example 2    

const link = document.querySelector("#trackThisLink");

link.addEventListener("click", (e) => {
  Piwik.queue("trackLinkUrl", e.target.getAttribute("href"), "linkType")
}, false);

```

### Piwik-API-Reference

Check: [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript).