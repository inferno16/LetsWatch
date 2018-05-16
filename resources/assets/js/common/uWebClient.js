/* 
The websocket comunication must be changed.
This is a temporary solution
*/

module.exports = (function(){
    var ws = undefined;

    function connect(address = 'ws://109.104.194.40:3000/TEST', protocol = null) {
        if(typeof(ws) !== 'undefined') {ws.close();}
        ws = new WebSocket(address, protocol);
        return ws;
    }

    function getWS(){return ws;}

    function sendPlayRequest() {
        ws.send('player: play');
    }

    function sendPauseRequest() {
        ws.send('player: pause');
    }

    function sendBufferingRequest() {
        ws.send('player: buffering');
    }

    function sendSeekingRequest() {
        ws.send('player: seeking');
    }

    function sendSeekRequest(second) {
        ws.send('player: seek('+second+')');
    }

    function sendSyncRequest(second) {
        ws.send('player: sync('+second+')');
    }

    function sendMediaRequest(url) {
        ws.send('video: '+url);
    }

    return {
        connect: connect,
        getWS: getWS,
        sendPlayRequest: sendPlayRequest,
        sendPauseRequest: sendPauseRequest,
        sendBufferingRequest: sendBufferingRequest,
        sendSeekingRequest: sendSeekingRequest,
        sendSeekRequest: sendSeekRequest,
        sendSyncRequest: sendSyncRequest,
        sendMediaRequest: sendMediaRequest
    }
})();