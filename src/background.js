chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'https://ai-' + yesterday() + '.fakeopen.com/auth'});
});

chrome.webRequest.onBeforeRedirect.addListener(
    function (details) {
        if (details.redirectUrl.startsWith('https://chat.openai.com/api/auth/callback/auth0?')) {
            const state = new URL(details.redirectUrl).searchParams.get('state');
            if (!state.startsWith('fkstate:')) {
                return;
            }
            chrome.storage.local.set({url: details.redirectUrl}, function () {
                chrome.tabs.update(details.tabId, {url: 'auth.html'});
            });
            return {cancel: true};
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

function yesterday() {
    let now = new Date();

    let prev = new Date(now.getTime() - 864e5);
    return prev.toISOString().substring(0, 10).replaceAll('-', '');
}
