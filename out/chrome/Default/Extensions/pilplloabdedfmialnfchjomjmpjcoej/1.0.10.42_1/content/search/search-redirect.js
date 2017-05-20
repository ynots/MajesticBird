(function(){

    function sprintf(str, params){
        var formatted = str;
        for (var k in params) {
            var v = params[k];
            var regexp = new RegExp('\\{'+(k)+'\\}', 'gi');
            formatted = formatted.replace(regexp, v);
        }
        return formatted;
    }

    var searchInManifest = config['srch.mfst'];


    function yahooParam2Beacon(cat){
        return utils.yahooParam2Beacon(cat ,4)
    }

    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            var url = details.url;

            var a = document.createElement('a');
            a.href = url;
            var method = '';
            var se = localStorage.getItem('sengine') || localStorage.getItem('sengine') ||  SEARCH_ENGINES_DEFAULT;
            if (a.pathname == '/' || a.pathname == ''){
                var type = a.search.substr(1,1);
                switch(type){
                    case 's': method = 'SuggestUrl';break;
                    case 'u':
                    case 'h':
                        return {redirectUrl:"chrome://newtab"};
                        break;
                }
                var search_terms = a.search.substr(3);
            }else{
                method = 'SearchUrl';
                var search_terms = decodeURIComponent(a.pathname.substring(1));
                user['selected_cat'] = 'web';
                setTimeout(function(){
                    utils.count('c.sob');			// count search query from omni box
                    utils.mark_time('act.sob');		// mark search query from omni box activity time
                    utils.mark_active();			// mark general user activity
                    trackStatusEvent('search-ob');
                },100);
            }
            var url = SEARCH_ENGINES[se][method];
            try{
                var cc = utils.get('cc');
                // if search engine is yahoo and monetization is on (mnz.ccyho != null) and we have monetization date (mnz.mmdd) and install time exists
                if (method == 'SearchUrl' && se == 'yahoo' && isYahooMarket(cc)){
                    var ycc = getYahooSubDomain(cc);
                    if (ycc == null){
                        var url = 'https://search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type='+user['aflt']+'&p={searchTerms}'+yahooParam2Beacon('web')
                        ycc = 'us';
                    }
                    else{
                        //var MMDD = utils.get('mnz.mmdd').substr(0,4);
                        var url = 'https://'+ycc+'.search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type='+user['aflt']+'&p={searchTerms}'+yahooParam2Beacon('web')

                    }
                }
                else if(se == 'yahoo' && !isYahooMarket(cc)){
                    url = SEARCH_ENGINES[se]['nm_SearchUrl'];
                }
                else if(se == 'yahoo'){
                    url = url.replace('{{aflt}}',user['aflt']);
                }
                else if(se == 'bing' && isBingMarket(cc)){
                    url = url.replace('{{aflt}}',user['b_aflt']);
                }
                else if(se == 'bing'){
                    url = SEARCH_ENGINES[se]['nm_SearchUrl'];
                }
                else if(SEARCH_ENGINES_IS.indexOf(user['sengine']) > -1){
                    var ls_whitelist = {"cd":"cd","cr":"cr","uref":"uref","aflt":"aflt"};
                    for(var i in ls_whitelist){
                        url = url.replace('{{'+i+'}}',user[i]);
                    }
                }



            }catch(e){}

            var locale = '';
            var search_url = sprintf(url,{searchTerms:search_terms,lang:locale});

            if(localStorage['ds1'] == 1 && method != 'SuggestUrl'){
                search_url = chrome.extension.getURL('/content/newtab.html')+'?'+encodeURIComponent(search_url)+'#ds1';

                chrome.tabs.update(details.tabId,{'url':search_url},null);

            }

            return {'redirectUrl': search_url};

        },
        {urls: ["*://"+searchInManifest+"/*"]},
        ["blocking"]
    );



    chrome.runtime.onInstalled.addListener(function (e) {

        if (e.reason == 'update') {

            if(user['sengine'] != 'google'){
                abtestMngr.firstRun()
            }

            var thisVersion = chrome.runtime.getManifest().version;
            if (thisVersion != e.previousVersion){

                setTimeout(function () {
                        trackStatusEvent('update');
                }, 10);

            }
        }
    });


}());