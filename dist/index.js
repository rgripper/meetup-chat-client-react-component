import { useEffect, useState, createElement } from 'react';
import { ChatClient } from 'meetup-chat-client';

var connectAndSubscribe = function (serverUrl, setChatClient, handleChange) {
    var chatClient = ChatClient.connect(serverUrl);
    setChatClient(chatClient);
    var subscription = chatClient.stateChanges.subscribe(function (d) { console.log(d); handleChange(d); });
    return function () {
        chatClient.disconnect();
        subscription.unsubscribe();
    };
};
var ChatDataSource = function (props) {
    var component = props.component, serverUrl = props.serverUrl, userName = props.userName;
    var _a = useState(undefined), clientState = _a[0], setClientState = _a[1];
    var _b = useState(undefined), chatClient = _b[0], setChatClient = _b[1];
    if (serverUrl) {
        useEffect(function () { return connectAndSubscribe(serverUrl, setChatClient, setClientState); }, [serverUrl, component, serverUrl, userName]);
    }
    if (!clientState || !chatClient) {
        return null;
    }
    return (createElement(props.component, { clientState: clientState, login: chatClient.tryLogin, sendText: chatClient.sendText }));
};

export { ChatDataSource };
