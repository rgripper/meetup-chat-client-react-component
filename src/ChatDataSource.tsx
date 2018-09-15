import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import memoizeOne from "memoize-one";
import { Subscription } from "rxjs";

interface Props {
  onChange?: (state: ClientState) => any;
  serverUrl?: string;
  userName?: string;
}

interface State extends Props {
  chatClient?: ChatClient;
  subscription?: Subscription;
  handleChange: (state: ClientState) => any;
}

export class ChatDataSource extends React.PureComponent<Props, State> {
  state: State = {
    handleChange: (state: ClientState) => {
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    }
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> | null {
    const nextState = { ...prevState, ...nextProps };

    if (nextProps.serverUrl !== prevState.serverUrl) {
      if (prevState.chatClient) {
        prevState.chatClient.disconnect();
      }

      if (prevState.subscription) {
        prevState.subscription.unsubscribe();
      }

      if (nextProps.serverUrl) {
        nextState.chatClient = ChatClient.connect(nextProps.serverUrl);
        nextState.subscription = nextState.chatClient.stateChanges.subscribe(
          nextState.handleChange
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
    if (this.state.chatClient) {
      this.state.chatClient.disconnect();
    }

    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
  }
}
