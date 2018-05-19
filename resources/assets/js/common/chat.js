module.exports = (function(){
    var ws;
    var init = false;
    var chat;
    var player;
    var last_message = ''; // For testing purposes
    function Chat() {
        this.messages;
        this.input;
        this.button;
        this.card;
    }
    function InitChat(uWebSocketConnection, chatWrapper) {
        if(init || !chatWrapper) { retrun; }
        ws = uWebSocketConnection;
        chat = new Chat();
        chat.input = document.getElementById('msg-input');
        chat.button = document.getElementById('msg-btn');
        chat.messages = chatWrapper.getElementsByClassName('messages')[0];
        if(!(chat.input && chat.button && chat.messages)) {
            return;
        }
        chat.card = chatWrapper.getElementsByClassName('card')[0];
        player = document.getElementById('player');
        ResizeChat();
        Listeners('add');
        init = true;
    }

    function DeInitChat() {
        if(!init) { return; }
        Listeners('remove');
    }

    function Listeners(option) {
        window[option+'EventListener']('resize', ResizeChat);
        chat.input[option+'EventListener']('keydown', InputKeyDown);
        chat.button[option+'EventListener']('click', SendMessage);
        ws[option+'EventListener']('message', MessageReceived);
    }

    function MessageReceived(e) {
        if(e.data.match(/^chat: /)) {
            var message = e.data.substring(6, e.data.length);
            ConstructMessage(message, 'User', (message === last_message) ? 'mine' : '');
            last_message = '';
        }
    }

    function ConstructMessage(text, user, classes) {
        var div = document.createElement('div');
        div.setAttribute('class', 'msg-content'+ ((classes.length) ? ' '+classes : ''));
        var small = document.createElement('small');
        small.setAttribute('class', 'user');
        small.innerText = user;
        div.appendChild(small);
        var span = document.createElement('span');
        span.setAttribute('class', 'msg-data');
        span.innerText = text;
        div.appendChild(span);
        chat.messages.appendChild(div);
        ScrollContent();
    }

    function ResizeChat() {
        if(player) {
            chat.card.style.height = player.clientHeight+'px';
            ScrollContent();
        }
    }

    function SendMessage() {
        if(!init) { return; }
        if(chat.input.value.trim() !== '') {
            last_message = chat.input.value;
            uWS.sendChatMessage(chat.input.value);
            chat.input.value = '';
        } 
    }

    function InputKeyDown(e) {
        if (e.which == 13 || e.keyCode == 13) {
            SendMessage();
            return false;
        }
        return true;
    }

    function ScrollContent() {
        var style = window.getComputedStyle(chat.messages);
        if(style.hasOwnProperty('flexDirection') && style.flexDirection === 'column-reverse') {
            chat.messages.scrollTo(0, 0);
        }
        else{
            chat.messages.scrollTo(0, chat.messages.scrollHeight);
        }
    }

    function MoveCursorToEnd(el) {
        if (typeof el.selectionStart == "number") {
            el.selectionStart = el.selectionEnd = el.value.length;
        } 
        else if (typeof el.createTextRange != "undefined") {
            el.focus();
            var range = el.createTextRange();
            range.collapse(false);
            range.select();
        }
    }

    return {
        InitChat: InitChat,
        DeInitChat: DeInitChat
    }
})();