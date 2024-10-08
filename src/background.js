chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'https://token.oaifree.com/auth'});
});

chrome.webRequest.onBeforeRedirect.addListener(
    function (details) {
        if (details.redirectUrl.startsWith('com.openai.chat://auth0.openai.com/ios/com.openai.chat/callback?')) {
            const state = new URL(details.redirectUrl).searchParams.get('state');
            if (!state.startsWith('ofstate:')) {
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


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "setOAIFreeData") {
        const u = request.u;
        const d = request.d;
        const domain = "auth0.openai.com";

        try {
            const cookies = await chrome.cookies.getAll({domain: domain});
            for (let cookie of cookies) {
                if ("cf_clearance" === cookie.name) {
                    continue;
                }

                await chrome.cookies.remove({
                    url: `https://${domain}/`,
                    name: cookie.name
                });
            }

            await chrome.cookies.set({
                url: `https://${domain}/`,
                name: "auth0",
                value: d,
                domain: "." + domain,
                path: "/",
                secure: true,
                httpOnly: true
            });

            if (sender.tab && sender.tab.id) {
                await chrome.tabs.update(sender.tab.id, {url: u});
                sendResponse({status: "success"});
            } else {
                sendResponse({status: "failure", message: "Invalid sender tab."});
            }
        } catch (error) {
            console.log(error);
            sendResponse({status: "failure", message: error.message});
        }

        return true;
    }
});
