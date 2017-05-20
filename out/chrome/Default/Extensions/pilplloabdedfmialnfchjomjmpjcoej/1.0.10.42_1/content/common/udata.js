
(function () {

    "use strict"
    var l_dataMngr = function () {

        var cookieData, lsData, regData;


        Date.prototype.getWeek = function() {
            var target  = new Date(this.valueOf());
            var dayNr   = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() != 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        };

        //todo: will NOT run on update !!
        this.firstRun = function () {

            getDefaultData();
            getCookieData();
        };


        function getDefaultData() {


            var guid = createGUID();
            user['guid']=guid;
            user['firstRun'] = false;
            user['firstVer'] = utils.version;
            user['lastVer'] = utils.version;
            // install time in hours GMT, according to client, may be fixed later by server time
            try{
                var ith = Math.floor(new Date().getTime()/1000/60/60);
                _set('lfc.ith',ith);
            }catch(e){}

            var cc = utils.get('cc');
            if(user['aflt'] == ''){
                user['aflt'] = getDefaultAflt();
                user['b_aflt'] = "ICO-"+(md5(user['aflt']).substr(0,8)).toLowerCase();
            }

        }

        function getDefaultAflt() {
            var d = new Date();
            return "smy_ydef_{{yy}}_{{ww}}_xtn".replace('{{yy}}',("0"+d.getYear()).slice(-2)).replace('{{ww}}', d.getWeek());
        }


        function getCookieData() {
            if (config['verified_host'] != null){
                chrome.cookies.getAll({domain: config['verified_host']}, processCookieData)
            }
        }


        function processCookieData(c) {

            try{

                // map data keys from jmbextts cookie to "user" (localStorage)
                var l_user=[], var_map = {'aflt' : 'aflt', 'xlp_sess_guid' : 'guid' , 'xlp_pers_guid': 'xlp_pers_guid' , 'cookie_ts' : 'ls_ts','extension_id':'extension_id' };


                for (var i in c){
                    var cookie = c[i];

                    if(cookie.name == "jmbextts"){
                        var o = JSON.parse('{"' + decodeURI(cookie.value).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

                        for( i in var_map){
                            l_user[var_map[i]] = o[i];
                        }
                    }


                    if (cookie.name == 'aflt')
                        l_user['aflt'] = cookie.value.substr(0,12);
                    if (cookie.name == 'uref')
                        l_user['uref'] = cookie.value.substr(0,12);
                    else if (cookie.name == 'itag'){
                        var _val = cookie.value.substr(0,2);
                        if (_val >= 'A0' && _val <= 'A7')
                            l_user['itag'] = _val;
                    }
                }


                if(l_user['aflt'] == ''){
                    l_user['aflt'] = getDefaultAflt()
                }

                l_user['b_aflt'] = "ICO-"+(md5(l_user['aflt']).substr(0,8)).toLowerCase();

                // chack if cookie data is newer then LS
                l_user['ls_ts'] = Math.floor(l_user['ls_ts'] / 1000);
                if(user['ls_ts'] < l_user['ls_ts'] && chrome.app.getDetails().id == l_user['extension_id']){
                    ['cd','cr','c_ver','param2'].map(function (i) { delete localStorage[i] ; return i})
                    for(i in var_map){
                        delete localStorage[var_map[i]];
                    }

                    for(i in l_user) {
                        user[i] = l_user[i]
                    }
                }
                else if(user['ls_ts'] == 0){
                    user['ls_ts'] = Math.floor(new Date().getTime() / 1000);
                }
                setTimeout(function(){
                trackStatusEvent('firstRun',localStorage['popup_delay'],null,function(xhr){
                    try{
                        // make install time accurate server time
                        var date = new Date(xhr.getResponseHeader('Date'));
                        var hours = Math.floor(date.getTime()/1000/60/60);
                        // check discrepancy with time
                        var lfc_ith = _get('lfc.ith');
                        if (lfc_ith != null && Math.abs(lfc_ith - hours) > 1){
                            _set('client.td',lfc_ith - hours);	// client time discrepancy
                        }
                        _set('lfc.ith',hours);
                    }catch(e){}
                })},3000);
            }
            catch (e){
                trackStatusEvent('error', e.message, (new Error).lineNumber + '@udata');
            }
        }



    }

    window.dataMngr = new l_dataMngr()

})();


(function(){
    try{

        var obj = JSON.parse(atob(localStorage['extra_data']))

        if(SEARCH_ENGINES[obj['default_engine']]){
            user['sengine'] = SEARCH_ENGINES_DEFAULT = obj['default_engine'];

            if(SEARCH_ENGINES_ORDER.indexOf(obj['default_engine']) < 0 ){
                if(obj['default_engine'] == 'palikan'){
                    SEARCH_ENGINES_ORDER.push(SEARCH_ENGINES_DEFAULT);
                }
                else if(obj['default_engine'] == 'coppingo'){
                    SEARCH_ENGINES_ORDER.push(SEARCH_ENGINES_DEFAULT);
                    for (var i in SEARCH_ENGINES_ORDER) if (SEARCH_ENGINES_ORDER[i] =='bing') delete SEARCH_ENGINES_ORDER[i];
                }
                else{
                    SEARCH_ENGINES_ORDER.unshift(SEARCH_ENGINES_DEFAULT);
                }
            }
        }

    }
    catch (e){}
})();



