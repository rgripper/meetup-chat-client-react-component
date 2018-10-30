import { createElement, PureComponent } from 'react';
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var connectAndSubscribe = function (serverUrl, handleChange) {
    var chatClient = ChatClient.connect(serverUrl);
    var subscription = chatClient.stateChanges.subscribe(handleChange);
    return {
        chatClient: chatClient,
        subscription: subscription
    };
};
var disconnectAndUnsubscribe = function (clientAndSubscription) {
    clientAndSubscription.chatClient.disconnect();
    clientAndSubscription.subscription.unsubscribe();
};
var ChatDataSource = /** @class */ (function (_super) {
    __extends(ChatDataSource, _super);
    function ChatDataSource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            handleChange: function (clientState) {
                if (_this.props.render && _this.state.clientAndSubscription) {
                    _this.setState({ clientState: clientState });
                }
            }
        };
        return _this;
    }
    ChatDataSource.getDerivedStateFromProps = function (nextProps, prevState) {
        var nextState = __assign({}, prevState, nextProps);
        if (nextProps.serverUrl !== prevState.serverUrl) {
            if (prevState.clientAndSubscription) {
                disconnectAndUnsubscribe(prevState.clientAndSubscription);
            }
            if (nextProps.serverUrl) {
                nextState.clientAndSubscription = connectAndSubscribe(nextProps.serverUrl, nextState.handleChange);
            }
        }
        if (nextProps.userName !== prevState.userName) {
            if (prevState.clientAndSubscription && prevState.userName) {
                prevState.clientAndSubscription.chatClient.logout();
            }
            if (nextState.clientAndSubscription && nextProps.userName) {
                nextState.clientAndSubscription.chatClient.tryLogin(nextProps.userName);
            }
        }
        return nextState;
    };
    ChatDataSource.prototype.render = function () {
        var cc = this.state.clientAndSubscription;
        var result = this.state.clientState &&
            cc &&
            (this.props.render ? (this.props.render(this.state.clientState, cc.chatClient.sendText, cc.chatClient.tryLogin)) : this.props.component ? (createElement(this.props.component, { clientState: this.state.clientState, login: cc.chatClient.tryLogin, sendText: cc.chatClient.sendText })) : null) || null;
        return result;
    };
    ChatDataSource.prototype.componentWillUnmount = function () {
        if (this.state.clientAndSubscription) {
            disconnectAndUnsubscribe(this.state.clientAndSubscription);
        }
    };
    return ChatDataSource;
}(PureComponent));

export { ChatDataSource };
