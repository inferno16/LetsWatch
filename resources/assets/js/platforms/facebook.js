module.exports = (function(){   
    var ws;
    var fb_vid;
    var playHandler;
    var pauseHandler;
    var bufferHandler;
    var request = false;
    var initiator = false;
    var playing = false;
    var appID = '2197920740427350';
    var apiVersion = 'v2.6';
    var synced = false;

    function FBInit() {
        FB.init({
            appId: appID,
            xfbml: true,
            version: apiVersion
        });

        FB.Event.subscribe('xfbml.ready', function (msg) {
            if (msg.type === 'video') {
                fb_vid = msg.instance;
                fb_vid.unmute();
                playHandler = fb_vid.subscribe("startedPlaying", sHandler);
                pauseHandler = fb_vid.subscribe("paused", pHandler);
                bufferHandler = fb_vid.subscribe("startedBuffering", bHandler);
            }
        });
    }

    function bHandler() {
        if (!request) {
            setTimeout(function () { uWS.sendSeekRequest(fb_vid.getCurrentPosition()) }, 20);
        }
        else {
            request = false;
        }
    }

    function sHandler() {
        //fb_vid.pause();
        playing = true;
        if (!request) {
            uWS.sendPlayRequest();
        }
        else {
            request = false;
        }
    }

    function pHandler() {
        //fb_vid.play();
        playing = false;
        if (!request) {
            uWS.sendPauseRequest();
        }
        else {
            request = false;
        }
    }

    function InitFacebookSync(uWebSocketConnection) {
        ws = uWebSocketConnection;
        ws.addEventListener('message', MessageHandler);
        FBInit();
        synced = true;
    }

    function RemoveFacebookSync(hard = false) {
        synced = false;
        ws.removeEventListener('message', MessageHandler);
        var playerDiv = document.getElementById('player');
        if(!playerDiv) {
            return false;
        }
        if(hard) {
            playerDiv.parentNode.removeChild(playerDiv);
        }
        else {
            DestroyPlayer();
        }
    }

    function DestroyPlayer() {
        var container = document.getElementById("player");
        var div = document.createElement("div");
        div.setAttribute('id', 'player');
        container.parentNode.replaceChild(div, container);
        return div;
    }
    
    function NewVideo(url) {
        if(!url.match(/^https:\/\/www\.facebook\.com\/[a-zA-Z0-9_.\-]+\/videos\/[0-9]+\/?$/)) {return;}
        var div = DestroyPlayer();
        div.setAttribute('class', 'fb-video');
        div.setAttribute('data-width', '300');
        div.setAttribute('data-href', url);
        FB.XFBML.parse();
    }

    function MessageHandler(e) {
        request = true;
        var msg;
        if (msg = uWS.isValidObject(e.data, 'player')) {
            switch (msg.command) {
                case "play":
                    //playHandler.release("startedPlaying");
                    if (!playing)
                        fb_vid.play();
                    else
                        request = false;
                    //playHandler = fb_vid.subscribe("startedPlaying", sptmpHandler);
                    break;
                case "pause":
                    if (playing)
                        fb_vid.pause();
                    else
                        request = false;
                    break;
                case "seek":
                    //bufferHandler.release();
                    fb_vid.seek(Number.parseFloat(msg.value));
                    //bufferHandler = fb_vid.subscribe("startedBuffering", bHandler);
                    break;
                default:
                    request = false;
                    break;
            }
        }
        else {
            request = false;
        }
    }

    return {
        IsSynced: synced,
        InitSync: InitFacebookSync,
        RemoveSync: RemoveFacebookSync,
        NewVideo: NewVideo
    };
})();