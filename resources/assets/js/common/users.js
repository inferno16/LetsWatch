module.exports = (function(){
    var ws;
    var users = [];
    var nav;
    var timer = 0;
    var synced = false;
    var timerInterval = 20;
    var scrollSpeed = 10;
    var my_username;
    var owner = 0;
    var introduced = 0;
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

    function InitUsers(uWebSocketConnection, username) {
        if(synced) {return;}
        my_username = username;
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
        var msg;
        if(msg = uWS.isValidObject(e.data, 'user')) {
            switch(msg.command) {
                case 'connection':
                    if(owner) {
                        uWS.sendIntroduction(JSON.stringify(users), msg.user);
                    }
                    AddUser(msg.user);
                    break;
                case 'disconnection':
                    RemoveUser(msg.user);
                    break;
                case 'promotion':
                    introduced = 1;
                    owner = 1;
                    break;
                case 'introduction':
                    if(!introduced) {
                        var user_list = JSON.parse(msg.value);
                        for (let i = 0; i < user_list.length; i++) {
                            AddUser(user_list[i].Name);
                        }
                        introduced = 1;
                    }
                    break;
            }
        }
    }

    function ScrollForward() {
        ScrollReset(); // In case the previous timer was not cleared
        timer = setInterval(function() {
            ScrollXWrapper(nav.UserContainer, nav.UserContainer.scrollLeft + scrollSpeed);
        }, timerInterval);
    }

    function ScrollBack() {
        ScrollReset(); // In case the previous timer was not cleared
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
            timer = 0;
        } 
    }

    function AddUser(name) {
        // Creating new User object
        var user = new User();
        user.Name = name;
        user.Avatar = '/storage/images/default.jpg'; // For testing purposes
        // Creating the DOM elements
        var card = document.createElement('div');
        var holder = document.createElement('div');
        var avatar = document.createElement('img');
        var username = document.createElement('span');
        // Setting the attributes of the elements
        card.setAttribute('class', 'user-card');
        holder.setAttribute('class', 'avatar-holder');
        avatar.setAttribute('class', 'user-avatar');
        avatar.setAttribute('src', user.Avatar);
        avatar.setAttribute('title', user.Name);
        username.setAttribute('class', 'user-name');
        username.setAttribute('title', user.Name);
        username.innerText = user.Name;
        // Creating the structure and add to the DOM
        holder.appendChild(avatar);
        card.appendChild(holder);
        card.appendChild(username);
        nav.UserContainer.appendChild(card);
        // Save the user with a reference to the user-card for easier deletion
        user.Element = card;
        users.push(user);
    }

    function RemoveUser(name) {
        for (let i = 0; i < users.length; i++) {
            if(users[i].Name === name) {
                users[i].Element.parentNode.removeChild(users[i].Element);
                users.splice(i, 1);
                break;
            }
        }
    }

    return {
        IsSynced: synced,
        InitUsers: InitUsers,
        DeInitUsers: DeInitUsers,
        SetScrollSpeed: SetScrollSpeed,
        ScrollSpeed: scrollSpeed,
        GetUsername: function() {return my_username;}
    }
})();