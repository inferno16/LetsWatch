module.exports = (function(){
    var ws;
    var users = [];
    var nav;
    var timer;
    var synced = false;
    var timerInterval = 20;
    var scrollSpeed = 10;
    function User() {
        this.Name;
        this.Avatar;
        this.ID;
        this.Element;
    }
    function Navigation() {
        this.PrevButton;
        this.NextButton;
        this.UserContainer;
    }
    Navigation.prototype.CheckData = function() {
        return (this.PrevButton && this.NextButton && this.UserContainer);
    }

    function InitUsers(uWebSocketConnection) {
        if(synced) {return;}
        ws = uWebSocketConnection;
        ws.addEventListener('message', MessageHandler);
        nav = new Navigation();
        var wrapper = document.getElementById('room-users');
        if(!wrapper) {return;}
        nav.UserContainer = wrapper.getElementsByClassName('users')[0];
        nav.PrevButton = wrapper.getElementsByClassName('prev-btn')[0];
        nav.NextButton = wrapper.getElementsByClassName('next-btn')[0];
        if(!nav.CheckData()) {return;}
        Listeners('add');
        synced = true;
    }

    function DeInitUsers() {
        if(!synced) {return;}
        Listeners('remove');
        synced = false;
    }

    function Listeners(option) {
        ws[option+'EventListener']('message', MessageHandler);
        nav.PrevButton[option+'EventListener']('mousedown', ScrollBack);
        nav.NextButton[option+'EventListener']('mousedown', ScrollForward);
        document.body[option+'EventListener']('mouseup', ScrollReset);
    }

    function MessageHandler(e) {
        if(e.data.match(/^user_connected: (.+)$/)) {
            AddUser(e.data.substring(16, e.data.length));
        }
        else if(e.data.match(/^user_dissconnected: (.+)$/)) {
            RemoveUser(e.data.substring(20, e.data.length));
        }
    }

    function ScrollForward() {
        timer = setInterval(function() {
            ScrollXWrapper(nav.UserContainer, nav.UserContainer.scrollLeft + scrollSpeed);
        }, timerInterval);
    }

    function ScrollBack() {
        timer = setInterval(function() {
            ScrollXWrapper(nav.UserContainer, nav.UserContainer.scrollLeft - scrollSpeed);
        }, timerInterval);
    }

    function ScrollXWrapper(element, amount) {
        if(element.hasOwnProperty('scrollTo')) { // Normal browsers
            element.scrollTo(amount, 0);
        } else { // IE and Edge
            if(amount > element.scrollWidth - element.clientWidth) {
                element.scrollLeft = element.scrollWidth  - element.clientWidth;
            }
            else if(amount < 0) {
                element.scrollLeft = 0;
            }
            else {
                element.scrollLeft = amount;
            }
        }
    }

    function SetScrollSpeed(speed) {
        if(Number.parseInt(speed)) {
            scrollSpeed = speed;
        }
    }

    function ScrollReset() {
        if(timer) {
            clearInterval(timer);
        } 
    }

    function AddUser(name) {
        
    }

    function RemoveUser(name) {
        for (let i = 0; i < users.length; i++) {
            if(users[i].Name === name) {
                users[i].Element.parentNode.removeChild(users[i].Element);
                users.slice(i, 1);
                break;
            }
        }
    }

    return {
        IsSynced: synced,
        InitUsers: InitUsers,
        DeInitUsers: DeInitUsers,
        SetScrollSpeed: SetScrollSpeed,
        ScrollSpeed: scrollSpeed
    }
})();