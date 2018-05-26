/* 
The websocket comunication must be changed.
This is a temporary solution
*/

module.exports = (function(){
    var ws = undefined;
    var _attr = {
        obj:'object', 
        cmd:'command', 
        val:'value',
        usr:'user'
    };
    var _obj = {
        player: {
            name: 'player',
            cmds: ['play', 'pause', 'seek', 'seeking', 'buffering', 'sync'],
            vals: {seek: 'number', sync: 'number'}
        }, 
        chat: {
            name: 'chat',
            cmds: ['message'],
            vals: {message: 'string'}
        }, 
        user: {
            name: 'user',
            cmds: ['connection', 'disconnection', 'promotion', 'introduction'],
            vals: {introduction: 'string'}
        }, 
        media: {
            name: 'media',
            cmds: ['new'],
            vals: {new: 'string'}
        },  
        conn: {
            name: 'connection',
            cmds: [],
            vals: {}
        }
    };


    function connect(address = 'ws://109.104.194.40:3000/TEST', protocol = null) {
        if(typeof(ws) !== 'undefined') {ws.close();}
        ws = new WebSocket(address, protocol);
        return ws;
    }

    function getWS(){return ws;}

    function CreateObject(obj, cmd, value = null) {
        var json = {};
        json[_attr.obj] = obj;
        json[_attr.cmd] = cmd;
        json[_attr.usr] = LW_Users.GetUsername();
        if(value) {
            json[_attr.val] = value;
        }
        return JSON.stringify(json);
    }

    function CreatePlayerObject(cmd, value = null) {
        return CreateObject(_obj.player.name, cmd, value);
    }

    function CreateMediaObject(cmd, value = null) {
        return CreateObject(_obj.media.name, cmd, value);
    }

    function CreateChatObject(cmd, value = null) {
        return CreateObject(_obj.chat.name, cmd, value);
    }

    function CreateUserObject(cmd, value = null) {
        return CreateObject(_obj.user.name, cmd, value);
    }

    function sendPlayRequest() {
        ws.send(CreatePlayerObject('play'));
    }

    function sendPauseRequest() {
        ws.send(CreatePlayerObject('pause'));
    }

    function sendBufferingRequest() {
        ws.send(CreatePlayerObject('buffering'));
    }

    function sendSeekingRequest() {
        ws.send(CreatePlayerObject('seeking'));
    }

    function sendSeekRequest(second) {
        ws.send(CreatePlayerObject('seek', second));
    }

    function sendSyncRequest(second) {
        ws.send(CreatePlayerObject('sync', second));
    }

    function sendMediaRequest(url) {
        ws.send(CreateMediaObject('new', url));
    }

    function sendChatMessage(msg) {
        ws.send(CreateChatObject('message', msg));
    }

    function sendIntroduction(json_str, user) {
        var obj = CreateUserObject('introduction', json_str);
        obj = JSON.parse(obj)
        obj.user = user;
        ws.send(JSON.stringify(obj));
    }

    function isNumber(val) {
        return val.match(/^[+-]?[0-9]+(\.[0-9]+)$/);
    }

    function isValidObject(data, objType) {
        var jsObj;
        try {
            jsObj = JSON.parse(data);
            if(jsObj.object != objType) {return false;}
            for (let i = 0; i < _attr.length; i++) {
                if(!(_attr[i] in jsObj)) {return false;}               
            }
            if(_obj[jsObj.object].cmds.indexOf(jsObj.command) === -1) {return false;}
            if(jsObj.command in _obj[jsObj.object].vals) {
                var val = _obj[jsObj.object].vals[jsObj.command];
                if(val.trim() === '' || (val === 'number' && !isNumber(val))) {return false;}
            }
            
        } catch(error) {return false;}
        return jsObj;
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
        sendMediaRequest: sendMediaRequest,
        sendChatMessage: sendChatMessage,
        sendIntroduction: sendIntroduction,
        isValidObject: isValidObject
    }
})();