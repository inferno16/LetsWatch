module.exports = (function(){
    var ws;
    var player = undefined;
    var iframe;
    var done = false;
    var paused = true;
    var d = new Date();
    var sl = statusListener;
    var lastTime = {};
    var synced;

    function InitYouTubeSync(uWebSocketConnection) {
        ws = uWebSocketConnection;
        ws.addEventListener('message', MessageHandler);
        synced = true;
    }

    function RemoveYouTubeSync(hard = false) {
        synced = false;
        ws.removeEventListener('message', MessageHandler);
        if(player !== undefined) {
            player.destroy();
            player = undefined;
        }
        if(hard) {
            var playerDiv = document.getElementById('player');
            if(playerDiv) {
                playerDiv.parentNode.removeChild(playerDiv);
            }
        }
    }

    function NewVideo(url) {
        url = (url.indexOf('&') !== -1) ? url.substring(0, url.indexOf('&')) : url;
        url.trim()
        var regex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=(.+)$/;
        var matches = regex.exec(url);
        if(!matches) {
            regex = /^(https?:\/\/)?(www\.)?youtu\.be\/(.+)$/
            matches = regex.exec(url);
        }
        if(matches.length === 4) {
            if(player !== undefined) {
                player.destroy();
                player = undefined;
                done = false;
                paused = true;
            }
            ConstructPlayer(matches[3]);
            return true;
        }
        return false;
    }
    
    function ConstructPlayer(key) {
        player = new YT.Player('player', {
            playerVars: {
                //modestbranding: 1,
                showinfo: 0,
                rel: 0
            },
            videoId: key
        });
        iframe = player.getIframe();
        player.addEventListener('onReady', InitPlayer);
        player.addEventListener('onStateChange', statusListener);
        player.getIframe().addEventListener('playerInitialized', function(){
            if(!done) {
                statusListener = sl;
                done = true;
                Debug("Player initialized!");
            }
        });
    }

    function InitPlayer() {
        if(done){return;}
        player.mute();
        player.playVideo();
    }
    
    function PauseVideo(p = player) {
        p.pauseVideo();
        paused = true;
    }

    function PlayVideo(p = player) {
        p.playVideo();
        paused = false;
    }

    function MessageHandler(e) {
        var prevState = statusListener;
        statusListener = sl;
        sync.statusRequest = true;
        if(e.data.match(/^player: /i)) {
            var cmd = (e.data.indexOf('(') === -1) ? e.data : e.data.substring(0, e.data.indexOf('('));
            switch(cmd) {
                case "player: play":
                    sync.type = YT.PlayerState.PLAYING;
                    player.playVideo();
                    break;
                case "player: pause":
                    sync.type = YT.PlayerState.PAUSED;
                    player.pauseVideo();
                    break;
                case "player: seek":
                    var regex = /\((\d+(\.\d+)?)\)$/;
                    var matches = regex.exec(e.data);
                    if(matches.length === 3) {
                        sync.type = YT.PlayerState.BUFFERING;
                        player.seekTo(matches[1]);
                    }
                    break;
                default:
                    statusListener = prevState;
                    sync.statusRequest = false;
                break;
            }
        }
        else{
            statusListener = prevState;
            sync.statusRequest = false;
        }
    }
    var sync = {statusRequest: false, type: -1};

    function Debug(msg) {
        console.debug(msg);
    }

    function statusListener(e) {
        //Debug("Inside statusListener " + e.data + ', ' + done);
        statusListener = function(){};
        if(sync.statusRequest && e.data === sync.type) {
            if(sync.type === YT.PlayerState.BUFFERING)
                uWS.sendPlayRequest();
            else
                paused = (e.data !== YT.PlayerState.PLAYING);
            statusListener = sl;
            sync.statusRequest = false;
            return;
        }
        switch (e.data) {
            case YT.PlayerState.PLAYING:
                //Debug('Inside the onPlay handler '+done);
                if(!done) {
                    Debug('Initializing...');
                    PauseVideo();
                    statusListener = sl;
                } else if(paused){
                    //Debug('Inside the onPlay handler');
                    PauseVideo();
                    uWS.sendPlayRequest();
                } else{
                    statusListener = sl;
                }
                break;
            case YT.PlayerState.PAUSED:
                //Debug('Inside the onPause handler');
                if(!done){
                    player.seekTo(0);
                    player.unMute();
                    var initEvent = new Event('playerInitialized');
                    setTimeout(function(){player.getIframe().dispatchEvent(initEvent)}, 100);
                } else if(!paused) {
                    PlayVideo();
                    uWS.sendPauseRequest();
                } else{
                    statusListener = sl;
                }
                break;
            case YT.PlayerState.BUFFERING:
                if(!done) {
                    statusListener = sl;
                }
                else {
                    uWS.sendSeekRequest(player.getCurrentTime());
                }
                break;
            default:
                statusListener = sl;
                break;
        }
    }

    return {
        IsSynced: synced,
        InitSync: InitYouTubeSync,
        RemoveSync: RemoveYouTubeSync,
        NewVideo: NewVideo
    };
})();