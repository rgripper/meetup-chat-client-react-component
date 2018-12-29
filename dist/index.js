import { useState, useEffect, createElement, PureComponent } from 'react';
import { ChatClient } from 'meetup-chat-client';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var connectAndSubscribe = function (serverUrl, setChatClient, handleChange) {
    var chatClient = ChatClient.connect(serverUrl);
    setChatClient(chatClient);
    var subscription = chatClient.stateChanges.subscribe(handleChange);
    return function () {
        chatClient.disconnect();
        subscription.unsubscribe();
    };
};
var ChatDataSource = /** @class */ (function (_super) {
    __extends(ChatDataSource, _super);
    function ChatDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatDataSource.prototype.render = function () {
        var _a = this.props, component = _a.component, serverUrl = _a.serverUrl, userName = _a.userName;
        var _b = useState(undefined), clientState = _b[0], setClientState = _b[1];
        var _c = useState(undefined), chatClient = _c[0], setChatClient = _c[1];
        if (serverUrl) {
            useEffect(function () { return connectAndSubscribe(serverUrl, setChatClient, setClientState); }, [serverUrl, component, serverUrl, userName]);
        }
        if (!clientState || !chatClient) {
            return null;
        }
        return (createElement(this.props.component, { clientState: clientState, login: chatClient.tryLogin, sendText: chatClient.sendText }));
    };
    return ChatDataSource;
}(PureComponent));

export { ChatDataSource };
