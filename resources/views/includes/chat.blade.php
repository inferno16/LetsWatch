<div class="card">
    <div class="card-header">
        {{ __('Chatbox for room').' '.$info['stream_key']}}
    </div>
    <div class="card-body">
        <div class="messages">
        </div>
        <div class="inputs">
            <input type="text" name="" id="msg-input">
            <input type="button" value="{{ __('Send') }}" id="msg-btn">
        </div>
    </div>
</div>