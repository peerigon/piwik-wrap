# piwik-wrap

**A Promise-based wrapper for the Piwik JavaScript Tracking Client providing an enjoyable API**

piwik-wrap wraps the Piwik [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript) and
provides an easy to use API for non- and Single Page Applications without polluting global namespace.
All [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript) methods are directly 
accessible through piwik-wrap.

## usage

### .init()
Before any other call Piwik must be initialized.

```javascript
// client bootstrapping 

import Piwik from "piwik-wrap";

// ... some other imports and declarations

Piwik.init("https://my.piwik-instance.com", siteId);


```

### .loadScript()
`.loadScript()` returns a `Promise` and initializes the `Promise`-chain.

```javascript
Piwik
    .init("https://my.piwik-instance.com", siteId)
    .loadScript()
    .catch((err) => console.error(err));
```

### .then()

```javascript
// e.g. in a Controller

var Piwik = require("piwik-wrap");

// ...

Piwik
    .init("https://my.piwik-instance.com", siteId)
    .loadScript()
    .then(() => Piwik.setDocumentTitle(document.title)
    .then(() => Piwik.setCustomUrl(document.location.href)) 
    .then(() => Piwik.trackPageView());

```

### .queue()

It is also possible to use `.queue()` if you are unfamiliar with Promises.

```javascript
// client bootstrapping

import Piwik from "piwik-wrap";

// ...

Piwik.init("https://my.piwik-instance.com", siteId).loadScript();

// app.js

class App {

    // ...
    
    changePage() {
        Piwik
            .queue("Piwik.setDocumentTitle", document.title)
            .queue("setCustomUrl", "document.location.href")
            .queue("trackPageView");
    }
    
    // ...

}


```

### .p

```javascript
// client bootstrapping

import Piwik from "piwik-wrap";

// ...

Piwik.init("https://my.piwik-instance.com", siteId).loadScript();

// PageA.js

class Page {

    // ...

    initTracking() {
        const link = document.querySelector("#trackThisLink");
    
        link.addEventListener("click", (e) => {
            Piwik.p.then(() => Piwik.trackLink(e.target.getAttribute("href") "linkType");
        }, false)
    }
    
    // ...

}

// PageComponent.js

import React from "react";
import Piwik frtom "piwik-wrap";

const PageComponent = React.createClass({
    // ...
    
    componentDidMount() {
        Piwik.p
            .then(() => Piwik.setDocumentTitle(document.title))
            .then(() => Piwik.setCustomUrl(document.location.href))
            .then(() => Piwik.trackPageView());
    }
    
    // ...

});
```


### Piwik-API-Reference

Check: [JavaScript Tracking Client](http://developer.piwik.org/api-reference/tracking-javascript).
