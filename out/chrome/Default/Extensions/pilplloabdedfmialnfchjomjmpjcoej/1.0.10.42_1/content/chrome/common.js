//Creating GUID on first run
function createGUID(){
    try{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }catch(e){}
}

function ajax(method,url,params,callback,err){
    var xhr=new XMLHttpRequest();
    xhr.open(method,url);
    xhr.timeout = 5000;
    //xhr.ontimeout = function () { console.log(url+" Timed out!!! "); }
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            if (typeof callback == 'function'){
                callback(xhr);
            }
        }else if (xhr.readyState == 4){
            if (typeof err == 'function'){
                err(xhr.status);
            }
        }
    }
    xhr.send(params);
}

function ajax_get(url,params,type,callback,err){
    ajax('GET',url,params,function(xhr){
        if (typeof callback == 'function'){
            if (type == 'xml'){
                callback(xhr.responseXML);
            }else if (type =='text'){
                callback(xhr.responseText);
            }else{
                callback(JSON.parse(xhr.responseText));
            }
        }
    },err);
}

function ajax_post(url,params,type,callback,err){
    ajax('POST',url,params,function(xhr){
        if (typeof callback == 'function'){
            if (type == 'xml'){
                callback(xhr.responseXML);
            }else if (type =='text'){
                callback(xhr.responseText);
            }else{
                callback(JSON.parse(xhr.responseText));
            }
        }
    },err);
}

function ajax_head(url,callback,err){
    ajax('HEAD',url,null,function(xhr){
        if (typeof callback == 'function')
            callback(xhr);
    },err);
}



(function(window){

    window.getBrowserFlavor = function (type) {
        chrome_str = (type == 'beacon') ? "chrome" : config['client'];
        chmm_str = (type == 'beacon') ? "chmm" : "chromium";

        var i ,p = window.navigator.plugins, b = chrome_str;
        for(i=0;i<p.length;i++){
            if(p[i].name.indexOf('PDF') > -1 && p[i].name.indexOf('Chromium') > -1){
                b = chmm_str;
            }
        }
        return b;
    }

    window.trackStatusEventGetData = function(evtType,extra1,extra2,callback){
        var assets = '', click_location = '';
        if(typeof extra1 == "object" && extra1 != null){
            click_location = extra1['click_location'] || '';
            assets = extra1['assets'] || '';
            extra1 = extra1['extra1']|| localStorage['popup_delay'] || '' ;
        }
        else if(localStorage['popup_delay'] && !extra1) {
            extra1 = localStorage['popup_delay'];
        }


        try {
            // console.log(localStorage);
            // console.log(user);
            click_location = 'click_location=' + click_location;
            assets = 'asset=' + assets;
            var aflt = 'aflt=' + user['aflt'];
            var ptag = 'ptag=' + user['b_aflt'];
            var evt = 'evt=' + evtType;
            var client = 'client=' + getBrowserFlavor();
            var itag = 'itag=' + user['itag'];
            var uref = 'uref=' + user['uref'];
            var firstVer = 'firstver=' + user['firstVer'];
            var cd = 'cd=' + user['cd'];
            var cr = 'cr=' + user['cr'];
            var sengine = 'sengine=' + user['sengine'];
            var ext_cc = 'ext_cc=' + (utils.get('cc') || '');
            var pver = 'pver=' + config['pver'];
            var ptype = 'ptype=' + config['type'];
            var label = 'label=' + config['label'];
            var ver = 'ver=' + utils.version;
            var id4 = 'id=' + utils.id4;
            var guid = 'guid=' + user['guid'];
            var xlp_sess_guid = 'xlp_sess_guid=' + user['guid'];
            var xlp_pers_guid = 'xlp_pers_guid=' + user['xlp_pers_guid'];
            var _extra1 = 'extra=' + (extra1 || '');
            var _extra2 = 'extra2=' + (extra2 || '');
            var z = 'z=' + (1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000)));
            var data_arr = [assets, ptag, click_location, evt, aflt, uref, firstVer,  itag, client, pver, ptype, label, ver, id4, guid, _extra1, _extra2, z, xlp_pers_guid, xlp_sess_guid, cd, cr, sengine, ext_cc];

            if( evt.indexOf('evt=search-set') == -1 && evt.indexOf('evt=search-') == 0 )
                data_arr.push( 'scategory=' + user['selected_cat'].toLowerCase() );

            var data =  data_arr.join('&');
            return btoa(data);
        }catch(e){}

    };

    window.trackStatusEvent = function(evtType,extra1,extra2,callback){
        ajax('POST',"https://"+config['track'],JSON.stringify({"table": "extensions_b64", "data": window.trackStatusEventGetData(evtType,extra1,extra2,callback)}),callback);
    };
}(this));
