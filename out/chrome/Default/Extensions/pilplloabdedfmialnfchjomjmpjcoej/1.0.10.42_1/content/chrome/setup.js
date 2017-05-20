(function(){
	"use strict";
	var _get = utils.get;
	var _set = utils.set;
    localStorage['setting_geo'] = (new Date()).getTime();

	function updateGeoData(){
        // setup user geo
        ajax_post(config['geolocator'],null,'json',function(result){

            var cc = result.country_code;

            utils.set('cc',cc);
            user['geodata'] = JSON.stringify(result);

            if(cc.toLocaleLowerCase() != 'us'){
                user['units_weather'] = 'metric';
                user['date_format'] = '{{d}}.{{m}}.{{y}}';
            }
            else{
                user['units_weather'] = 'imperial';
                user['date_format'] = '{{m}}.{{d}}.{{y}}';
            }
            if ( !user['sengine'] )
            {

                if(abtestMngr.isInAbtest(["wogwbg","wogdbg"])){
                    SEARCH_ENGINES_ORDER = SEARCH_ENGINES_ORDER.slice(0,-1)
                    delete SEARCH_ENGINES['google'];
                    SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[0];

                }


                if (isYahooMarket(cc)){
                    SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[0];
                }
                else if (isBingMarket(cc)){
                    SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[1];
                }


                // SEARCH_ENGINES_DEFAULT = (isYahooMarket(cc) ? SEARCH_ENGINES_ORDER[0] : SEARCH_ENGINES_ORDER[2]);
                user['sengine'] = SEARCH_ENGINES_DEFAULT;                
				chrome.runtime.sendMessage({refreshList : true,engine:SEARCH_ENGINES_DEFAULT},function(res){});
            }

            utils.localstorage2cookie();
            delete localStorage['setting_geo'];

        },function(d){
            delete localStorage['setting_geo'];
        });

    };

    updateGeoData()
    setInterval(updateGeoData , 5*60*60*1000);

    var newtab_url = chrome.extension.getURL(chrome.app.getDetails().chrome_url_overrides.newtab);

    chrome.browserAction.onClicked.addListener(function(){
        trackStatusEvent('tb_icon_click');
        chrome.tabs.create({url:newtab_url},function(){});

    });

	if (user['firstRun']){

        abtestMngr.firstRun();

        localStorage['popup_delay'] = 4000;


        localStorage['ds1'] = 1;
        localStorage['nt1'] = 1;

        dataMngr.firstRun();

    }else{
        if (user['lastVer'] != utils.version){
            // don't show welcome message

            // there's an upgrade
            user['lastVer'] = utils.version;
        } else {
            $(document).ready(function(){
                setTimeout(function(){
                    trackStatusEvent('restart_bg_nt');
                },1000);
            });
        }
    }

    utils.localstorage2cookie();

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(request.ext){

                var als = JSON.parse(atob(request.ext));
                //localStorage.clear()
                for(var i in als){
                    localStorage[i] = als[i];
                }

                if(!als['sengine']){
                    delete localStorage['sengine'];
                }
            }
            else if(request.getall){
                sendResponse({ext : btoa(JSON.stringify(localStorage))})
            }
        });

}());
