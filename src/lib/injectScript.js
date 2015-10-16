"use strict";

const injectScript = (script) => {
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
};

export default injectScript;