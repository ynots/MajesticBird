(function(){

    document.addEventListener("localstorage2cookie", function(data) {
        var ls_keys = {'sengine':false , 'bg_img':false , 'bg_color':false,'date_format':false, 'units_weather':false};
        for(var i in ls_keys) {
            if (localStorage[i]) {
                ls_keys[i] = localStorage[i]
            }
            else {
                delete ls_keys[i];
            }
        }

        chrome.runtime.sendMessage({ext : btoa(JSON.stringify(ls_keys))}, function(response) {
            console.log(response);
        });

    })

    function setLocalStorage(b64data){
        var als = JSON.parse(atob(b64data))
        localStorage.clear()
        for(var i in als){
            localStorage[i] = als[i];
        }

        if(!als['sengine']){
            delete localStorage['sengine'];
        }
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            setLocalStorage(request.ext)
        });


    chrome.runtime.sendMessage({getall : true}, function(response) {
        setLocalStorage(response.ext)
    });

})();