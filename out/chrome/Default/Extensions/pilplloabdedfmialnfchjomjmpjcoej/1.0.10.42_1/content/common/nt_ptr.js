(function () {
    
    return false;

    "use strict";

    var extid = chrome.app.getDetails().id;
    var newtab_url = chrome.extension.getURL(chrome.app.getDetails().chrome_url_overrides.newtab);

    chrome.tabs.onUpdated.addListener(hook_nt);
    var updatecount = {}


    function hook_nt(tabId, details, tab) {
        // if (settings.search_bar === false) return;
        updatecount[tabId] = updatecount[tabId] || 1;
        updatecount[tabId] += 1;
        if ((tab.url.indexOf('chrome://newtab/') == 0 && tab.url.indexOf(extid) < 0) || !(tab.url != 'chrome://newtab/' && tab.url.indexOf(extid) != 0))
            chrome.tabs.update(tabId, { url: newtab_url+"?"+updatecount[tabId]+extid});
        
    }
    
})();