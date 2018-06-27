module.exports = (function() {
    var player;
    var us;
    var synced = false;
    var playerObj;
    var allowedExtensions = ['mp3', 'mp4', 'webm'];

    function InitSlimPlayerSync(uWebSocketConnection) {
        ws = uWebSocketConnection;
        ws.addEventListener('message', MessageHandler);
        synced = true;
    }

    function RemoveSlimPlayerSync(hard = false) {
        ws.removeEventListener('message', MessageHandler);
        RemoveEventListeners();
        SlimPlayer.DestroyPlayer(playerObj, true);
        var playerDiv = document.getElementById('player');
        if(hard) {
            playerDiv.parentNode.removeChild(playerDiv);
        }
        synced = false;
    }

    function NewVideo(url) {
        var extRegEx = /\.([A-Za-z0-9]{3,4})$/;
        var extension = extRegEx.exec(url);
        if(!extension)
            return;
        if(!playerObj) {
            var video = document.getElementsByClassName('SlimPlayer')[0];
            if(video) {
                playerObj = SlimPlayer.GetPlayerFromElement(video);
                if(!playerObj) {
                    playerObj = SlimPlayer.CreatePlayerFromElement(video);
                }
            }
            else {
                video = document.createElement('video');
                video.setAttribute('class', 'SlimPlayer');
                var source = document.createElement('source');
                video.appendChild(source);
                document.getElementById('player').appendChild(video);
                playerObj = SlimPlayer.CreatePlayerFromElement(video);
                video.addEventListener('playerConstructionDone', AttachEventListeners);
            }
        }
        player = playerObj.Player;
        var source = player.childNodes[0];
        source.setAttribute('src', url);
        player.load();
    }

    function AttachEventListeners() {
        if(playerObj.ControlEnabled()) {
            playerObj.ToggleControl(); // Disable the functionality of the play/pause button
        }
        playerObj.Player.addEventListener('SlimPlayerSeek', SeekHandler);
        playerObj.PlayButton.addEventListener('click', PlayHandler);
    }

    function RemoveEventListeners() {
        playerObj.Player.removeEventListener('SlimPlayerSeek', SeekHandler);
        playerObj.PlayButton.removeEventListener('click', PlayHandler);
    }

    function SeekHandler(e) {
        uWS.sendSeekRequest(e.detail);
    }

    function PlayHandler() {
        if(player.paused) {
            uWS.sendPlayRequest();
        }
        else {
            uWS.sendPauseRequest();
        }
    }

    function MessageHandler(e) {
        var msg;
        if (msg = uWS.isValidObject(e.data, 'player')) {
            switch (msg.command) {
                case "play":
                    player.play();
                    break;
                case "pause":
                    player.pause();
                    break;
                case "seek":
                    player.currentTime = msg.value;
                    break;
            }
        }
    }

    return {
        AllowedExtensions: allowedExtensions,
        IsSynced: synced,
        InitSync: InitSlimPlayerSync,
        RemoveSync: RemoveSlimPlayerSync,
        NewVideo, NewVideo
    }
})();