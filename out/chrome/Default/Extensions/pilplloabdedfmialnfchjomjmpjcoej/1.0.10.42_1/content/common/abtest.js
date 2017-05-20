(function () {

    "use strict";

    var abrange = false;
    var abname = false;


    //
    // with google, default color bg: uref=wgdbg
    // without google, default color bg: uref=wogdbg
    // with google, with white bg by default: uref=wgwbg
    // white bg, without google: uref=wogwbg

    var abtests = {
        "white_bg": {name: "whitebg"},
        // "wgdbg": {name: "wgdbg"},
        // "wogdbg": {name: "wogdbg"},
        // "wgwbg": {name: "wgwbg"},
        // "wogwbg": {name: "wogwbg"}

    };


    abrange = Math.ceil(Math.random() * 100);

    // if(abname)localStorage['abname'] = user['uref'] = abname;

    var l_abtestMngr = function () {

        var do_white = false;

        try {
            var extradata = JSON.parse(atob(localStorage['extra_data']));

            if (extradata['white_bg']) {
                do_white = true;
                abname = 'whitebg';

            }
            else if (extradata['activeab'] && abtests[extradata['activeab']]) {
                abname = abtests[extradata['activeab']]['name'];
            }
        }
        catch (e) {
        }
        if (!abname && localStorage['abname'] && abtests[localStorage['abname']]) {
            abname = localStorage['abname'];

            if (abtests[user['uref']]) {
                user['uref'] = abtests[user['uref']].name;
            }

            do_white = (["wgwbg", "wogwbg"].indexOf(abname) > -1);


        }
        else if(localStorage['abname'] && !abtests[localStorage['abname']]){
            delete localStorage['abname'];
        }


        this.firstRun = function () {

// abname = 'pntr2';
//
//             if (!abname && abrange < 50)
//                 abname = "wogdbg";
//             else if (!abname) {
//                 do_white = true;
//                 abname = "wogwbg";
//             }

            if (abname) user['uref'] = localStorage['abname'] = abname;


            if (!do_white) return;

            user['bg_img'] = 'none';
            user['bg_color'] = "#FFFFFF";

        };

        this.isInAbtest = function (name) {
            if (Array.isArray(name))
                return (name.indexOf(abname) > -1);
            return (abname == name);
        };

        this.docReady = function () {
            this.stateChanged();
        };

        this.stateChanged = function () {
            if (!do_white) return;

            if (user['bg_color'] == '#FFFFFF') {
                $('body').removeClass('dark_bg').addClass('light_bg');
            }
            else {
                $('body').removeClass('light_bg').addClass('dark_bg');
            }

            $('#search-button').text('');
        }

    }


    window.abtestMngr = new l_abtestMngr()


})();


