var SEARCH_ENGINES = {
    'palikan' :
    {
        "ShortName": "Palikan",
        "LongName" : "Palikan Search",
        "InputEncoding" : "UTF-8",
        "SearchUrl": "http://www.palikan.com/?cd={{cd}}&cr={{cr}}&a={{aflt}}&q={searchTerms}",
        "SuggestUrl" : "http://ff.search.yahoo.com/gossip?output=fxjson&command={searchTerms}",
        'Images' : 'http://www.palikan.com/results.php?category=images&start=1&cd={{cd}}&cr={{cr}}&a={{aflt}}&q=' ,
        'Videos' : 'http://www.palikan.com/results.php?category=video&start=1&cd={{cd}}&cr={{cr}}&a={{aflt}}&q=' ,
        "SearchForm":"https://www.palikan.com/"
    },
    'coppingo' :
    {
        "ShortName": "Coppingo",
        "LongName" : "Coppingo Search",
        "InputEncoding" : "UTF-8",
        "SearchUrl": "http://www.coppingo.com/?cd={{cd}}&cr={{cr}}&a={{aflt}}&q={searchTerms}",
        "SuggestUrl" : "http://ff.search.yahoo.com/gossip?output=fxjson&command={searchTerms}",
        'Images' : 'http://www.coppingo.com/results.php?category=images&start=1&cd={{cd}}&cr={{cr}}&a={{aflt}}&q=' ,
        'Videos' : 'http://www.coppingo.com/results.php?category=video&start=1&cd={{cd}}&cr={{cr}}&a={{aflt}}&q=' ,
        "SearchForm":"http://www.coppingo.com/"
    },
    'google' :
    {
        "ShortName": "Google",
        "LongName" : "Google Search",
        "InputEncoding" : "UTF-8",
        "SearchUrl": "http://www.google.com/search?sourceid=chrome&ie=utf-8&oe=utf-8&aq=t&hl={lang}&q={searchTerms}",
        "SuggestUrl": "http://www.google.com/complete/search?client=firefox&ie=utf-8&oe=utf-8&hl={lang}&gl={country}&q={searchTerms}",
        'Images' : 'https://www.google.com/search?biw=1235&bih=730&tbm=isch&sa=1&btnG=Search&q=' ,
        'Videos' : 'https://www.google.com/search?tbm=vid&hl=en&source=hp&biw=&bih=&btnG=Google+Search&oq=&gs_l=&q=',
        "SearchForm":"https://www.google.com/"
    },
    'yahoo' :
    {
        "ShortName" : "Yahoo",
        "LongName" : "Yahoo Search",
        "InputEncoding" : "UTF-8",
        "SuggestUrl" : "http://ff.search.yahoo.com/gossip?output=fxjson&command={searchTerms}",
        "SearchForm" : "http://search.yahoo.com/",
        "SearchUrl" : "http://search.yahoo.com/yhs/search/?ei=UTF-8&hspart=itm&hsimp=yhs-001&type={{aflt}}&p={searchTerms}",
        'Images' : 'https://{{ycc}}images.search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type={{aflt}}&p=' ,
        'Videos' : 'https://{{ycc}}video.search.yahoo.com/yhs/search?hspart=itm&hsimp=yhs-001&type={{aflt}}&p=',
        "nm_SearchUrl" : "http://search.yahoo.com/search/?ei=UTF-8&p={searchTerms}",
        'nm_Images' : 'https://images.search.yahoo.com/search/images?p=' ,
        'nm_Videos' : 'https://video.search.yahoo.com/search/video?p=',
        "Logo" : "/skin/images/yahoo.png"
    },
    'bing' :
    {
        "ShortName": "Bing",
        "LongName" : "Bing. Search by Microsoft!",
        "InputEncoding" : "UTF-8",
        "SearchUrl": "http://www.bing.com/search?FORM=INCOH2&PC=IC03&PTAG={{aflt}}&q={searchTerms}",
        'Images' : 'http://www.bing.com/images?FORM=INCOH2&PC=IC03&PTAG={{aflt}}&q=' ,
        'Videos' : 'http://www.bing.com/videos?FORM=INCOH2&PC=IC03&PTAG={{aflt}}&q=',
        "nm_SearchUrl": "http://www.bing.com/search?q={searchTerms}",
        'nm_Images' : 'http://www.bing.com/images?q=' ,
        'nm_Videos' : 'http://www.bing.com/videos?q=',
        "SuggestUrl": "http://api.bing.com/osjson.aspx?query={searchTerms}&language={lang}",
        "SearchForm":"http://www.bing.com/search",
        "Logo" : "/skin/images/bing.png"
    }


};

var SEARCH_ENGINES_IS = ['coppingo' , 'palikan'];
var SEARCH_ENGINES_ORDER = ['yahoo' , 'bing'];
var SEARCH_ENGINES_DEFAULT = SEARCH_ENGINES_ORDER[0];

var BingMarkets = ['us', 'gb', 'fr', 'de', 'es', 'it', 'jp', 'ca', 'au', 'nl', 'br', 'at', 'be', 'lu', 'fi', 'no', 'dk', 'se', 'nz', 'in'];

BingMarkets= [];



function isBingMarket(cc){
    try{
        cc = cc.toLowerCase();
        if (BingMarkets.indexOf(cc) < 0)
            return false;
        return true;
    } catch(e){
        return false;
    }
}


var yahooMarketsData = {
    'country_to_market' : {"ar":{"def":"ar"},"at":{"def":"at"},"br":{"def":"br"},"ca":{"fr":"qc","def":"ca"},"ch":{"it":"chit","fr":"chfr","def":"ch"},"cl":{"def":"cl"},"co":{"def":"co"},"de":{"def":"de"},"dk":{"def":"dk"},"es":{"def":"es"},"fi":{"def":"fi"},"fr":{"def":"fr"},"hk":{"def":"hk"},"in":{"def":"in"},"id":{"def":"id"},"it":{"def":"it"},"my":{"def":"malaysia"},"mx":{"def":"mx"},"nl":{"def":"nl"},"no":{"def":"no"},"pe":{"def":"pe"},"ph":{"def":"ph"},"sg":{"def":"sg"},"se":{"def":"se"},"tw":{"def":"tw"},"th":{"def":"th"},"gb":{"def":"uk"},"ie":{"def":"uk"},"uk":{"def":"uk"},"ve":{"def":"ve"},"vn":{"def":"vn"}},
    'supported_countries' : ['us','my','ar','at','br','ca','cl','co','dk','fi','fr','uk','de','hk','in','id','it','mx','nl','no','pe','sg','es','se','tw','th','ve','vn','ch','gb','ph','ie']
};


function isYahooMarket(cc){
    try{

        cc = cc.toLowerCase();
        if (yahooMarketsData.supported_countries.indexOf(cc) < 0)
            return false;
        return true;

    } catch(e){
        return false;
    }
}

function getYahooSubDomain(cc){
    try{

        cc = cc.toLowerCase();
        if (!isYahooMarket(cc)){
            return;
        }

        return  (yahooMarketsData.country_to_market[cc] ? (yahooMarketsData.country_to_market[cc][utils.language] ? yahooMarketsData.country_to_market[cc][utils.language] : yahooMarketsData.country_to_market[cc]['def']) : 'us');

    } catch(e){
        return;
    }
}

