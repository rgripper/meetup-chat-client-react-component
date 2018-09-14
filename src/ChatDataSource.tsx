import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import memoizeOne from "memoize-one";
import { Subscription } from "rxjs";

interface Props {
  onChange?: () => ClientState;
  serverUrl?: string;
  userName?: string;
}

interface State extends Props {
  chatClient?: ChatClient;
  subscription?: Subscription;
}

export class ChatDataSource extends React.PureComponent<Props, State> {

  state: State = {};

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> | null {
    const nextState = { ...prevState, ...nextProps };

    if (nextProps.serverUrl !== prevState.serverUrl) {
      if (prevState.chatClient) {
        prevState.chatClient.disconnect();
      }

      if (nextProps.serverUrl) {
        nextState.chatClient = ChatClient.connect(nextProps.serverUrl);
      }
    }

    if (nextProps.onChange !== prevState.onChange) {
      if (prevState.subscription) {
        prevState.subscription.unsubscribe();
      }

      if (nextProps.onChange && nextState.chatClient) {
        nextState.subscription = nextState.chatClient.stateChanges.subscribe(
          nextProps.onChange
        );
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
  }

  render() {
    return null;
  }

  componentWillUnmount() {
    if (this.state.subscription) this.state.subscription.unsubscribe();
  }
}
