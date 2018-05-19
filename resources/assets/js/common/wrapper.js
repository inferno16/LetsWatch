// WebSocket client logic
window.uWS = require('./uWebClient');

// Chat
window.LW_Chat = require('./chat');

// Patform scripts 
window.LWxYT = require('../platforms/youtube');
window.LWxFB = require('../platforms/facebook');
window.LWxSP = require('../platforms/proprietary');

module.exports = (function(){
    var Platform = {name:'', object: {}};
    var ws = undefined;

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
                        InitPlatform(matches[3], LWxYT);
                    }
                    break;
                case 'facebook':
                    if(matches[4] === 'com' && matches[5].match(/^[a-zA-Z0-9_.\-]+\/videos\/[0-9]+$/i)) {
                        // Might have to add more checks since Facebook requires the whole URL
                        // instead of just the key
                        InitPlatform(matches[3], LWxFB);
                    }
                    break;
                default:
                    var extRegEx = /\.([A-Za-z0-9]{3,4})$/;
                    var extension = extRegEx.exec(matches[5]);
                    if(extension !== null && LWxSP.AllowedExtensions.indexOf(extension[1].toLowerCase()) !== -1) {
                        InitPlatform('proprietary', LWxSP);
                    }
                    else {
                        if(Platform.object && Platform.name)
                            Platform.object.RemoveSync();
                        Platform.object = null;
                    }
                    break;
            }
        }
    }

    function InitPlatform(name, newPlatform) {
        if(Platform.object && Platform.name && Platform.name !== name)
            Platform.object.RemoveSync();
        Platform.name = name;
        Platform.object = newPlatform;
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

    function CreateEventHandlers(roomID) {
        if(!ws) {
           ws = uWS.connect('ws://109.104.194.40:3000/'+roomID);
        }
        var url_input = document.getElementById('media-url');
        var load_btn = document.getElementById('load-btn');
        FormAction(url_input, load_btn, NewVideo);
        
        LW_Chat.InitChat(ws, document.getElementById('chat-wrapper'));
    }

    function FormAction(input, button, func) {
        if(input && button) {
            button.addEventListener('click', function(){
                if(input.value.trim() !== '') {
                    func(input.value);
                    input.value =  '';
                }
            });
            return true;
        }
        return false;
    }

    return {
        CreateEventHandlers: CreateEventHandlers,
        NewVideo: NewVideo
    };
})();