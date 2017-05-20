// defines a settings mechanism
// exposes two objects
// 1. user - for user preferences. read user['key'] , write user['key'] = val
// 2. conf = for sys configuraion. read only conf['key']




$(window).bind('storage', function (e) {
     console.log(e,e.originalEvent.key, e.originalEvent.newValue);
});


// setting user default prefs is via calling pref('key','value') in /defaults/preferences/
// setting conf defaults by calling conf('key','value) in common/conf.js 
(function(){
	"use strict";
	(function(){
		var PREFIX='';//'$pref.';	
		var PREFS = {}
		
		function get(name){

			var result=localStorage[PREFIX+name]
			if (result == null){
				result = PREFS[name];
				return result
			};
			if (typeof result == 'string'){
				if (result == 'false')
					return false;
				else if (result == 'true')
					return true;
				else if (typeof parseInt(result) != 'number' && result !='NaN')
					return result
				else if (parseInt(result) == result)
					return parseInt(result)
				else
					return ""+result;
				// not supporting float, to be cross browser compatible (firefox prefs do not support float
			}			
			return result
		}
		
		function set(name,val){

			var defaultValue=PREFS[name];
			var _name=PREFIX+name;
			if (typeof val == 'object'){
				throw "object type not supported";
			}else if (defaultValue == val && localStorage[_name] != null) // the != null to avoid raising storage event handler
				delete localStorage[_name]
			else if (val == null)
				delete localStorage[_name]
			else
				localStorage[_name]=val		
		}

		var user = {};
		var pref = function(name,defaultValue){
			if (defaultValue == null)
				if (name == null)
					throw "name and defaultValue must have a concrete values"
				else
					return user[name]
			if (typeof name != 'string')
				throw "name is not of type string"
			PREFS[name]=defaultValue;
			user.__defineGetter__(name,function(){
				return get(name);
			})
			user.__defineSetter__(name,function(val){
				set(name,val);
			})
		}
		
		//window.addEventListener('storage', bindingHandler, false);	
		
		// the object for settings default pref('key','value');
		window.pref = pref;
		// the object to access setter and getter.  user[key] = 'newValue'; console.log(user[key]);  
		window.user = user;
	}());

	(function(){
		var CONFS = {};
		var config = {};
		var conf = function(name,value){
			CONFS[name] = value;
			config.__defineGetter__(name,function(){
				return CONFS[name];
			});	
			config.__defineSetter__(name,function(val){
				throw "config is not mutable, if you need mutable key/val, use preferences machanism";
			})
		};
		window.conf = conf;
		window.config = config;	
	}());


}());