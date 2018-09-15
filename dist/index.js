import { PureComponent } from 'react';
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

var ChatDataSource = /** @class */ (function (_super) {
    __extends(ChatDataSource, _super);
    function ChatDataSource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            handleChange: function (state) {
                if (_this.props.onChange) {
                    _this.props.onChange(state);
                }
            }
        };
        return _this;
    }
    ChatDataSource.getDerivedStateFromProps = function (nextProps, prevState) {
        var nextState = __assign({}, prevState, nextProps);
        if (nextProps.serverUrl !== prevState.serverUrl) {
            if (prevState.chatClient) {
                prevState.chatClient.disconnect();
            }
            if (prevState.subscription) {
                prevState.subscription.unsubscribe();
            }
            if (nextProps.serverUrl) {
                nextState.chatClient = ChatClient.connect(nextProps.serverUrl);
                nextState.subscription = nextState.chatClient.stateChanges.subscribe(nextState.handleChange);
            }
        }
        if (nextProps.userName !== prevState.userName && nextState.chatClient) {
            if (prevState.userName) {
                nextState.chatClient.logout();
            }
            if (nextProps.userName) {
                nextState.chatClient.tryLogin(nextProps.userName);
            }
        }
        return nextState;
    };
    ChatDataSource.prototype.render = function () {
        return null;
    };
    ChatDataSource.prototype.componentWillUnmount = function () {
        if (this.state.chatClient) {
            this.state.chatClient.disconnect();
        }
        if (this.state.subscription) {
            this.state.subscription.unsubscribe();
        }
    };
    return ChatDataSource;
}(PureComponent));

export { ChatDataSource };
