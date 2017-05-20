(function(window){
	"use strict";
	var details = chrome.app.getDetails();
	var version = details.version;
	var id = details.id;
	function _get(key){
		return localStorage[key];	
	}
	
	function _set(key,value){
		localStorage[key] = value;
	}

	function _reset(alsoContext){
		localStorage.clear();
	}
	
	var locale = navigator.languages[0] || navigator.language ;
	var language = locale.substr(0,2);
	var os = (function() {
		var ua = navigator.userAgent.toLowerCase();
		if (/windows nt 5.0/.test(ua)){
			return 'win2K';
		}else if (/windows nt 5.0/.test(ua)){
			return 'winXP';
		}else if (/windows nt 6.0/.test(ua)){
			return 'vista';
		}else if (/windows nt 6.1/.test(ua)){
			return 'win7';
		}else if (/windows nt 6.2/.test(ua)){
			return 'win8';
		}else if (/windows nt 6.3/.test(ua)){
			return 'win8.1';
		}
    }());
	var utils = {
		get os(){
			return os;
		},
		get id(){
			return id;
		},
		get id4(){
			return id.substring(0,4)
		},
		get version(){
			return version;
		},
		get locale(){
			return locale;
		},
		get language(){
			return language;
		},		
		get : function(key){
			return _get(key);
		},
		set : function(key,value){
			_set(key,value);
		},
		remove : function(key){
			delete localStorage[key];
		},
		yymmdd : function(){
			try{
				var date = new Date();
				return	(date.getUTCFullYear()+"").slice(-2)
					 +('0' + (date.getUTCMonth()+1)).slice(-2)
					 +('0' + date.getUTCDate()).slice(-2)
					 +('0' + date.getUTCHours()).slice(-2);
					 // +('0' + date.getUTCMinutes()).slice(-2);
			}catch(e){}
		},
		count : function(k){	
			var v = this.get(k);
			if (v == null)
				v = 1;
			else
				v++;
			this.set(k,v);		
		},
		mark_time : function(key){
			this.set(key,new Date().getTime());
		},
		mark_active : function(){
			var that = this;
			// lfc_act = lifecycle active date
			this.mark_day('lfc.act','active',true,function(newday){
				if (newday)
					that.count('c.act');	// count new day activity
			});
		},
		mark_day : function(key,evt,st_evt,callback){
			var yymmdd = this.yymmdd();
			var new_day = false;
			if (this.get(key) == null || this.get(key) != yymmdd){
				this.set(key,yymmdd);
				new_day = true;
				if (st_evt){
					trackStatusEvent(evt);
				}
			}
			if (typeof callback == 'function')
				callback(new_day);
		},



        yahooParam2Beacon : function(cat , f){
			
             f = f || 4;
             cat = cat || 'web';

             if(localStorage['param2'] && localStorage['param2'] != ''){
                 var data = 'f={{f}}&ip={{ip}}&cat={{cat}}&xlp_pers_guid={{xlp_pers_guid}}&xlp_sess_guid={{xlp_sess_guid}}&uref={{uref}}'+localStorage['param2'];
             }
             else{
                 var data = 'f={{f}}&b={{b}}&ip={{ip}}&pa=search-manager&type={{aflt}}&cat={{cat}}&a={{aflt}}&xlp_pers_guid={{xlp_pers_guid}}&xlp_sess_guid={{xlp_sess_guid}}&uref={{uref}}';

             }

             try{
                 data = data
                     .replace(/\{\{aflt\}\}/g,user['aflt'])
                     .replace('{{cat}}',cat)
                     .replace('{{f}}',f)
                     .replace('{{os}}',navigator.platform)
                     .replace('{{xlp_sess_guid}}',(user['guid'] || ''))
                     .replace('{{xlp_pers_guid}}',(user['xlp_pers_guid'] || ''))
                     .replace('{{uref}}',(user['uref'] || ''))
                     .replace('{{b}}', getBrowserFlavor('beacon'))

             }
             catch (e){}

             try{
                 var geodata = JSON.parse(user['geodata']);
                 data = data.replace('{{ip}}',geodata.ip);
             }
             catch (e){}

             return "&param1=1&param2="+encodeURIComponent(data);
        },

        localstorage2cookie : function(){
			// setTimeout(function(){
				var ls_data = btoa(JSON.stringify({"table": "extensions_b64", "data": trackStatusEventGetData('uninstall')}));
				var uninstall_url = 'http://support.'+config['verified_host']+'/uninstall/index.html';

				chrome.runtime.setUninstallURL(uninstall_url);

				chrome.cookies.set({url : uninstall_url, domain : config['verified_host'], name: 'url_data', value : "https://"+config['track'], expirationDate : ((new Date()).getTime() + 60*60*24*365)}, function(){})
				chrome.cookies.set({url : uninstall_url, domain : config['verified_host'], name: 'ls_data', value : ls_data, expirationDate : ((new Date()).getTime() + 60*60*24*365)}, function(){})
			// },1000);


			// chrome.runtime.sendMessage({ext : ls_data}, function(response) {
             //    console.log(response);
            // });
        }

};
	window.utils = utils;
}(this));
