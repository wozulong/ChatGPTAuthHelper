(function () {
    window.addEventListener('message', function (event) {
        if (event.source !== window) {
            return;
        }

        if (event.data && event.data.type === 'SET_OAI_FREE_DATA') {
            chrome.runtime.sendMessage({action: 'setOAIFreeData', u: event.data.u, d: event.data.d});
        }
    });

    const evt = new CustomEvent('ChatGPTAuthHelperEvent300', {});
    window.dispatchEvent(evt);
})();