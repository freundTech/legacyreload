reloadIcon = {
    "19": "icons/refresh.svg",
    "38": "icons/refresh.svg",
    "48": "icons/refresh.svg"
};
cancelIcon = {
    "19": "icons/cancel.svg",
    "38": "icons/cancel.svg",
    "48": "icons/cancel.svg"
};

let gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then(function (tabs) {
    for (tab of tabs) {
        showPageAction(tab.id);
    }
});

let loadingTabs = {};

browser.tabs.onUpdated.addListener(function (tabId) {
    showPageAction(tabId);
});

browser.pageAction.onClicked.addListener(function (tab) {
    if (loadingTabs[tab.id]) {
        browser.tabs.update(tab.id, {url: "about:blank"});
        delete loadingTabs[tab.id];
    }
    else {
        browser.tabs.reload(tab.id);
        browser.pageAction.setIcon({path: cancelIcon, tabId: tab.id});
        loadingTabs[tab.id] = true;
    }
});

browser.webNavigation.onCompleted.addListener(function (details) {
    browser.pageAction.setIcon({path: reloadIcon, tabId: details.tabId});
    delete loadingTabs[details.tabId];
});
browser.webNavigation.onErrorOccurred.addListener(function (details) {
    browser.pageAction.setIcon({path: reloadIcon, tabId: details.tabId});
    delete loadingTabs[details.tabId];
});

function showPageAction(tabId) {
    browser.pageAction.show(tabId);
}