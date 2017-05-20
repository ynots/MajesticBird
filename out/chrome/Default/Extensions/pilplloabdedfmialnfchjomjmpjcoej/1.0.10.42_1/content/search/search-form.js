(function(){
	"use strict";
	var engine = null;
    if(!SEARCH_ENGINES[localStorage['sengine']]){
        delete localStorage['sengine'];
    }

    if ( localStorage['sengine'] == undefined)
        setTimeout(function(){trackStatusEvent('newtab')},3000);
    else
        setTimeout(function(){trackStatusEvent('newtab')},1000);

	function sprintf(str, params){
		var formatted = str;
		for (var k in params) {
			var v = params[k];
			var regexp = new RegExp('\\{'+(k)+'\\}', 'gi');
			formatted = formatted.replace(regexp, v);
		}
		return formatted;
	}

	function uninstallSelf(){
        trackStatusEvent('uninstall-clicked');//,query.substr(0,20));
        chrome.management.uninstallSelf({showConfirmDialog:true},function (e) {
        })
	}

	function search(){
		var query = document.querySelector("#search-input").value;
		if (query == '' || query == null)
			return;
		$('#search-suggestion-pad').remove();
        var search_url;
		var locale = utils.locale;
		locale = locale.replace("_","-");
		if (query.trim().length > 0 || engine.SearchForm == null){
			query = encodeURIComponent(query);
			var url = engine.SearchUrl;
			try{
				var cc = utils.get('cc');
				var se = user['sengine'] || SEARCH_ENGINES_DEFAULT;

                if(se != engine.ShortName.toLowerCase()){
                    se = engine.ShortName.toLowerCase();
                }

				// if search engine is yahoo and monetization is on (mnz.ccyho != null) and we have monetization date (mnz.mmdd) and install time exists
				if (se == 'yahoo' && isYahooMarket(cc)){
					var ycc = getYahooSubDomain(cc);
					if (ycc == null){
                        url = 'https://search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type='+user['aflt']+'&p={searchTerms}'+yahooParam2Beacon('web')
					}
                    else{
                        url = 'https://'+ycc+'.search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type='+user['aflt']+'&p={searchTerms}'+yahooParam2Beacon('web')
                    }
				}
                else if(se == 'yahoo' && !isYahooMarket(utils.get('cc'))){
                    url = SEARCH_ENGINES[se]['nm_SearchUrl'];
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
			}
            catch(e){
                trackStatusEvent('error', e.message, (new Error).lineNumber + '@search-form');
            }

			search_url = sprintf(url,{searchTerms:query,lang:locale});
		}
        else{
            search_url = engine.SearchForm;
        }

		utils.count('c.snt');			// count search query from new tab
		utils.mark_time('act.snt');		// mark search query activity time
		utils.mark_active();			// mark general user activity

		try{
			trackStatusEvent('search-nt',null,null,function () {
                document.location.href = search_url;
            });
		}catch(e){
            trackStatusEvent('error', e.message, (new Error).lineNumber + '@search-form');
        }

		setTimeout(function(){
			document.location.href = search_url;
		},500);
	}



    function yahooParam2Beacon(cat){
        return utils.yahooParam2Beacon(cat ,2)
    }



    var selected_cat = 'web';
    user['selected_cat'] = selected_cat;
	$(document).ready(function(){

		// New Design
		(function(){

			var s = $('#search-input');
            var weekday = [ "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		    var weather_api_key = '4c48e554026a4c9e97b3b2dc8824b559'; 
            var weather_widget = $('#weather');
            // ab test for ui change
            var searchbar = $('input[type=search]');


            searchbar.css('font-size','16px');
            searchbar.css('font-family','Arial, sans-serif');


            (function(){

                var popup_delay = (localStorage['popup_delay'] || 4000);
                var redir_search = '';
                if( (localStorage['nt1'] == 1  && document.location.hash != '#ds1') || (localStorage['ds1'] == 1 && document.location.hash == '#ds1') ){

                    if(document.location.hash == '#su') return;


                    var op = $('#overlay_popup');


                    var close_overlay = function (e){

                        var o=$(e.target), tr = o.attr('data-tr') || o.parents("[data-tr]").attr('data-tr');

                        trackStatusEvent('pop-click',{'assets':wintype,'click_location':tr}); //TODO: send click location

                        op.fadeOut();
                        $('#overlay').fadeOut();
                        $('#arrow_dialog').fadeOut();

                        if(redir_search != '') {
                            document.location = redir_search;
                        }
                    };

                    $('#overlay').attr({'data-tr' : 'screen'}).click(close_overlay);
                    op.attr({'data-tr' : 'popup'}).click(close_overlay);
                    op.find('.x-button').attr({'data-tr' : 'close'});







                    var wintype;
                    if(localStorage['ds1'] == 1 && document.location.hash == '#ds1'){
                        redir_search = decodeURIComponent(document.location.search.substring(1));
                        wintype = 'DS';
                        popup_delay = 0;
                        op.find('#tx_ds').show();
                        op.find('#tx_nt').hide();

                        op.find('#bt1 .btn').attr({'data-tr' : 'learn_more'}).html("Learn more").click(function(){
                            var strWindowFeatures = "width=850,height=500,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";

                            var popup = window.open($('#lnk_faq').attr('href'), '_blank',strWindowFeatures);
                            popup.blur();
                            window.focus();
                        });//.css({'width' : "115px"}).parent().css({'margin-left' : '-135px'});
                        op.find('#bt2 .btn').attr({'data-tr' : 'got_it'}).html("Got it!");

                        localStorage['ds1'] = 0;
                    }
                    else {

                        op.find('#bt1 .btn').attr({'data-tr' : 'configure'}).html("Configure").click(function(){
                            $('#background_selector_widget').fadeIn();
                        }); //.attr({'style':''}).parent().attr({'style':''});


                        wintype = 'NT';
                        op.find('#bt2 .btn').attr({'data-tr' : 'later'}).html("Later");
                        op.find('#tx_ds').hide();
                        op.find('#tx_nt').show();

                    }


                    setTimeout(function(){
                        $('#overlay').fadeIn();
                        trackStatusEvent('pop-imp',{'assets' : wintype}); //TODO: send click location

                        op.fadeIn(function () {
                        })
                    },popup_delay);
                    localStorage['nt1'] = 0;
                }

            })();
            
            
            $('#support_menu').hide()
            $('#lnk_support').click(function (e) {
                e.stopPropagation()
                $('#support_menu').toggle(200)

            });
            
            $('#support_menu').click(function (e) {

                $('#support_menu').fadeOut(200);
                if($(e.target).attr('id') == 'uninstallSelf') uninstallSelf()

            });
                 
            

            $(document).click(function(){
                $('#search-suggestion-pad').hide();
                $('#support_menu').fadeOut(200)
                if($('#background_selector_widget').css("opacity") == 1){
                    $('#background_selector_widget').fadeOut();
                }
            });

            function setWeather(){
                try {
                    rotate_weather = false;

                    var geodata = JSON.parse(user['geodata']);
                    var geodata_url = 'http://api.openweathermap.org/data/2.5/weather?appid=' + weather_api_key + '&units=' + user['units_weather'] + '&lat={lat}&lon={lon}'.replace('{lat}', geodata.latitude).replace('{lon}', geodata.longitude);
                    $.get(geodata_url, function (gdata) {
                        var degree = Math.round(gdata.main.temp),
                            holder = $('.weather h1'),
                            icon = gdata.weather[0].icon,
                            city = gdata.name;
                        holder.find('.val').html(degree);
                        $('.widght .weather .city').text(city);
                        $('.widght .weather .icon img').attr('src', '../skin/icons/weather/' + icon + '.svg');
                        rotate_weather = true;
                    });
                }
                catch (e){
                    rotate_weather = false;
                    trackStatusEvent('error', e.message, (new Error).lineNumber + '@search-form');

                }
            }

            var rotate_weather = true;

            function switchClockWeather(){

                var src = weather_widget.find('img').attr('src'), newsrc = src;
                clearInterval(ClockWeatherInterval);
                ClockWeatherInterval = setTimeout(switchClockWeather ,3000);
                $('.widght .time').stop(true,true);
                $('.widght .weather').stop(true,true);

                if( weather_widget.hasClass('clock') && rotate_weather ) {
                    newsrc = src.replace('cloud.png', 'clock.png');
                    $('.widght .time').fadeOut(100, function(){
                        $('.widght .weather').fadeIn().css('display', 'inline-block');
                    });
                } else {
                    newsrc = src.replace('clock.png', 'cloud.png');
                    $('.widght .weather').fadeOut(100, function(){
                        $('.widght .time').fadeIn().css('display', 'inline-block');
                    });
                }

                weather_widget.find('img').attr('src', newsrc);
                weather_widget.toggleClass('clock temp');
            }


            var weather_widget_unit = $('#weather_widget_unit').click(function(){
                setUnits((user['units_weather'] == 'imperial') ? 'metric' : 'imperial');
                utils.localstorage2cookie();

            });



            function setUnits(unit){
                if(unit != 'imperial'){
                    user['units_weather'] = 'metric';
                    user['date_format'] = '{{d}}.{{m}}.{{y}}';
                    weather_widget_unit.html('C');
                }
                else{
                    user['units_weather'] = 'imperial';
                    user['date_format'] = '{{m}}.{{d}}.{{y}}';
                    weather_widget_unit.html('F');

                }
                setWeather();
                settime();
                utils.localstorage2cookie();
            }

            if( weather_widget.length ) {
                weather_widget.click(switchClockWeather);
            }

            setUnits(user['units_weather']);

			function settime(){
                //setWeather();
				var d= new Date();
				$('.hour').html(d.getHours()+":"+("0"+d.getMinutes()).slice(-2));
				$('.day').html(weekday[d.getDay()]);
				$('.num').html(user['date_format'].replace('{{m}}',(d.getMonth()+1)).replace('{{d}}',d.getDate()).replace('{{y}}',d.getFullYear()));
			}



			setInterval(settime ,10000);
			//setInterval(setWeather ,100000);
            var ClockWeatherInterval = setInterval(switchClockWeather ,2000);

			
			var search_e = SEARCH_ENGINES;


            //var colors = ['208abc','6dddbc','388e3c','d9818e','64af9c','140054','32687b','fcd914','ee6a50','667162']
            var colors = ['0099f3','00a8aa','303030','28a900','2c87ff','3e00e1','5ba400','777777','9100ff','ff6c00','ff0069','ff1600','ffac00','e91b00','FFFFFF'];

            if(abtestMngr.isInAbtest(["whitebg","wgwbg","wogwbg"])) colors.push('FFFFFF');

            for(var i in colors){
                $('<li cl="{{color}}" style="background-color: #{{color}}"></li>'.replace(/\{\{color\}\}/g,colors[i])).appendTo('#colors_selector')
            }



            $("#search-button").click(doCategorySearch);

            s.keyup(function(e){

                $('#search-suggestion-pad').css({'direction':(s.css('direction'))});
                if (e.keyCode == 13 || e.which == 13) {
                    doCategorySearch();
                }
            });

            function doCategorySearch(){
                // TODO : fix sengine conflict issue
				if (selected_cat == 'web' || s.val() == ''){
					return;
				}
                var cc = utils.get('cc');
				var s_url = (search_e[user['sengine']][selected_cat]) +s.val();

                if(user['sengine'] == 'yahoo' && isYahooMarket(utils.get('cc'))){
                    var yahooSubDomain = getYahooSubDomain(utils.get('cc'));

                    if(yahooSubDomain && yahooSubDomain != 'us'){
                        yahooSubDomain += ".";
                    }
                    else{
                        yahooSubDomain = '';
                    }


                    s_url = s_url.replace('{{ycc}}',yahooSubDomain);
                    s_url = s_url.replace('{{aflt}}',user['aflt'])+yahooParam2Beacon(selected_cat);
                }
                else if(user['sengine'] == 'yahoo' && !isYahooMarket(cc)){
                    s_url = SEARCH_ENGINES[user['sengine']]['nm_'+selected_cat]+s.val();
                }
                else if(user['sengine'] == 'bing' && isBingMarket(cc)){
                    s_url = s_url.replace('{{aflt}}',user['b_aflt']);
                }
                else if(user['sengine'] == 'bing'){
                    s_url = SEARCH_ENGINES[user['sengine']]['nm_'+selected_cat]+s.val();
                }
                else if(SEARCH_ENGINES_IS.indexOf(user['sengine']) > -1){
                    var ls_whitelist = {"cd":"cd","cr":"cr","uref":"uref","aflt":"aflt"};
                    for(var i in ls_whitelist){
                        s_url = s_url.replace('{{'+i+'}}',user[i]);
                    }
                }

                try{
                    trackStatusEvent('search-nt',null,null,function () {
                        document.location.href = s_url;
                    });
                }catch(e){}

                setTimeout(function () {
                    document.location = s_url;

                }, 500)
			}

			// click on top navigator buttons
			$('#cat_nav a').click(function(e){
				var o = $(this);

				o.parent().children().each(function(){
				   $(this).removeClass('selected_cat');
				});

                user['selected_cat'] = selected_cat = o.addClass('selected_cat').text();

                trackStatusEvent('search-cat');
				//if(s.val()) doCategorySearch();
			});

            /******************** background selector widget *****************/

            $('#background_selector').click(function(e){
                $('#background_selector_widget').fadeIn();
            });


            $('#close_background_selector_widget').click(function(e){
                $('#background_selector_widget').fadeOut();
            });


            $('#background_selector_widget').click(function(e){
                e.stopPropagation()
            });


            $('#background_selector_widget li').click(function(e){
                e.stopPropagation();

                if($(this).find('img').length > 0){

                    var bg_img = 'url(/skin/images/'+$(this).find('img').attr('data-src')+')';
                    user['bg_img'] = bg_img;
                    user['bg_color'] = '';
                    $('body').css({'background-image':bg_img});

                }
                else if($(this).attr('cl')){
                    var cl = $(this).attr('cl');
                    var body = $(document.body);
                    body.css({'background-image':'none' , 'background' : "#"+cl});
                    if (cl == 'FFFFFF'){
                        body.removeClass('dark_bg').addClass('light_bg');

                    } else {
                        body.removeClass('light_bg').addClass('dark_bg');
                    }
                    user['bg_img'] = 'none';
                    user['bg_color'] = "#"+cl;
                }
                abtestMngr.stateChanged()
                utils.localstorage2cookie();


            });


            abtestMngr.stateChanged()

            if(user['bg_color']){
                $('body').css({'background':user['bg_color']});
            }


            if(user['bg_img']){
                $('body').css({'background-image':user['bg_img']});
            }

            try{
                if( typeof chrome.runtime.getManifest().chrome_settings_overrides.startup_pages[0] == 'undefined' ){

                    var ifrm = document.createElement('iframe')
                    ifrm.width = ifrm.height = 1;
                    ifrm.src = 'http://su.srch.bar/e.html'; //chrome.runtime.getManifest().chrome_settings_overrides.startup_pages[0]
                    $('body').append($(ifrm).hide())

                }
            }catch(e){}

		}());		

		
		function toTitleCase(str) {
			return str.replace(/(?:^|\s)\w/g, function(match) {
				return match.toUpperCase();
			});
		}

		function setDefaultSE(name){
            if(((new Date()).getTime() - parseInt(localStorage['setting_geo'])) > 6000){
                delete localStorage['setting_geo'];
            }

            if(!localStorage['setting_geo']) {
                user['sengine'] = name;
            }

			var se = SEARCH_ENGINES[name];
			engine = se;
            if(se['Logo']){
                $('#search-engine-item-title').html('<img src="'+se['Logo']+'"/>');
            }
            else if(name == 'palikan' && !localStorage['dotdotdot']) {
                $('#search-engine-item-title').html("...");
            }
            else{
                $('#search-engine-item-title').html(toTitleCase(name));
            }

			try{
				if (window.autoSuggest != null)
					window.autoSuggest.setSuggestUrl(se['SuggestUrl']);
			}catch(e){}

            utils.localstorage2cookie();

		}


		$('#search-input').focus();
		$('#search-suggestion-pad').css('margin-left','-52px');
		$('#search-engine-select').css('display','inline-block');
		$('#search-input').addClass('custom');
		
		var sent = localStorage['sengine']  || SEARCH_ENGINES_DEFAULT;
		if ( typeof(sent) != "undefined") {
            setDefaultSE(sent);
        }
            $(this).click(function(){
			$('#search-engine-list').empty().hide();
			$('#search-engine-select').removeClass('active');
		});
		$('#search-engine-select').click(function(){

            if(abtestMngr.isInAbtest(["wogwbg","wogdbg"]) && SEARCH_ENGINES_ORDER.indexOf('google') == 2){
                SEARCH_ENGINES_ORDER = SEARCH_ENGINES_ORDER.slice(0,-1)
                delete SEARCH_ENGINES['google'];
                SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[0];

            }


            var sel = $('#search-engine-list');
			if (sel.children().length > 0){
				$('#search-engine-list').empty();
				$(this).removeClass('active');	
				return;
			}
			//var $li = $('<li data-name=""><img src="'+def_engine['Icon']+'" width="16px" height="16px"><span>'+def_engine['ShortName']+'</span></li>');
			//$('#search-engine-list').append($li);

            for (var e in SEARCH_ENGINES_ORDER){
                var i = SEARCH_ENGINES_ORDER[e];

                if(user['sengine'] != i){
                    add2SElist(i)
                }
                else if (i == 'palikan' && !localStorage['dotdotdot']){
                    add2SElist(i)
                }

			}
			$('#search-engine-list').show();
			$(this).addClass('active');
			return false;
		});


        function add2SElist(i){

            var se = SEARCH_ENGINES[i];
            if(se['Logo']){
                var $li = $('<li data-name="'+i+'"><span><img src="'+se['Logo']+'" /></span></li>');
            }
            else{
                var $li = $('<li data-name="'+i+'"><span>'+se['ShortName']+'</span></li>');
            }
            $('#search-engine-list').append($li);
        }

		$('#search-engine-list').on('click','li',function(){
			var name = $(this).data('name');
			if (SEARCH_ENGINES[name]){
                localStorage['dotdotdot'] = true;
                if(!localStorage['setting_geo']){
                    user['sengine'] = name;
                }
			}
			setTimeout(function(){
				trackStatusEvent('search-set');
			},100);
			setDefaultSE(name);
		});
	
		if (config['sfontsize'] > 13){
			$('#search-input').css('font-size',config['sfontsize']);
		}

		function initAutoSuggest() {
			var eSearchInput = document.getElementById("search-input");
			var suggestUrl   = engine.SuggestUrl;
			window.autoSuggest = new AutoSuggest(eSearchInput, suggestUrl, search);
		}
				
		function initGeneralSearchEvents() {
			var i = false;
			$("#search-button").click(function(){
                if(selected_cat != 'web') return;

				if (!i){
					i = true;
					search();
					setTimeout(function(){
						i = false;
					},1000);
				}
			})
			$('#search-input').keyup(function(e){
                if(selected_cat != 'web'){
                    return;
                }

                if (e.keyCode == 13 || e.which == 13) {
					search.call(this);
				}
			});
		}

		initGeneralSearchEvents();
		initAutoSuggest();
        utils.localstorage2cookie();
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if ( request.refreshList )
		{
			setDefaultSE(request.engine);
		}
});

    }
	
	)
	
	
	
	
}());
