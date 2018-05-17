// WebSocket client logic
window.uWS = require('./uWebClient');

// Patform scripts 
window.LWxYT = require('../platforms/youtube');
window.LWxFB = require('../platforms/facebook');

module.exports = (function(){
    var Platform = {name:'', object: {}};
    var ws = uWS.connect();

    function InitPlatformFromUrl(url) {
        // First of all strip parameters and trim spaces and slashes from the URL
        url = (url.indexOf('&') !== -1) ? url.substring(0, url.indexOf('&')) : url;
        url = url.trim();
        url = url.replace(/\/+$/, '');

        var regex = /^(https?:\/\/)?(www\.)?([A-Za-z0-9_\-.]+)\.(\w{2,3})\/(.+)$/i;
        var matches = regex.exec(url);
        if(matches !== null) {
            matches[3] = matches[3].toLowerCase(); // site name
            matches[4] = matches[4].toLowerCase(); // site TLD
            switch(matches[3]) {
                case 'youtube':
                    if(matches[4] === 'com' && matches[5].match(/^watch\?v=[A-Za-z0-9_\-]{11}$/i)) {
                        if(Platform.name !== '' && Platform.name === matches[3])
                            Platform.object.RemoveSync();
                        Platform.name = matches[3];
                        Platform.object = LWxYT;
                    }
                    break;
                case 'facebook':
                    if(matches[4] === 'com' && matches[5].match(/^[a-zA-Z0-9_.\-]+\/videos\/[0-9]+$/i)) {
                        // Might have to add more checks since Facebook requires the whole URL
                        // instead of just the key
                        if(Platform.name !== '' && Platform.name === matches[3])
                            Platform.object.RemoveSync();
                        Platform.name = matches[3];
                        Platform.object = LWxFB;
                    }
                    break;
                default:
                    Platform.object = null;
                    break;
            }
        }
    }

    function NewVideo(url) {
        InitPlatformFromUrl(url);
        if(Platform.object) {
            if(!Platform.object.IsSynced) {
                Platform.object.InitSync(ws);
            }
            Platform.object.NewVideo(url);
        }
    }

    function CreateEventHandlers() {
        var url = document.getElementById('media-url');
        var btn = document.getElementById('load-btn');
        if(url && btn) {
            btn.addEventListener('click', function(){
                if(url.value.trim() !== '') {
                    NewVideo(url.value);
                    url.value =  '';
                }
            });
        }
    }

    return {
        CreateEventHandlers: CreateEventHandlers
    };
})();