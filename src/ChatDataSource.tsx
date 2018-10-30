import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import { Subscription } from "rxjs";

interface ClientAndSubscription {
  chatClient: ChatClient;
  subscription: Subscription;
}

const connectAndSubscribe = (
  serverUrl: string,
  handleChange: (clientState: ClientState) => any
): ClientAndSubscription => {
  const chatClient = ChatClient.connect(serverUrl);
  const subscription = chatClient.stateChanges.subscribe(handleChange);
  return {
    chatClient,
    subscription
  };
};

const disconnectAndUnsubscribe = (
  clientAndSubscription: ClientAndSubscription
): void => {
  clientAndSubscription.chatClient.disconnect();
  clientAndSubscription.subscription.unsubscribe();
};

interface InnerComponentProps {
  clientState: ClientState;
  login: (userName: string) => any;
  sendText: (text: string) => any;
}

interface Props {
  render?: (
    clientState: ClientState,
    login: (userName: string) => any,
    sendText: (text: string) => any
  ) => React.ReactNode;
  component?: React.ComponentType<InnerComponentProps>;
  serverUrl?: string;
  userName?: string;
}

type State = Props & {
  clientState?: ClientState;
  handleChange: (state: ClientState) => any;
  clientAndSubscription?: ClientAndSubscription;
};

export class ChatDataSource extends React.PureComponent<Props, State> {
  state: State = {
    handleChange: (clientState: ClientState) => {
      if (this.props.render && this.state.clientAndSubscription) {
        this.setState({ clientState });
      }
    }
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> | null {
    const nextState = { ...prevState, ...nextProps };

    if (nextProps.serverUrl !== prevState.serverUrl) {
      if (prevState.clientAndSubscription) {
        disconnectAndUnsubscribe(prevState.clientAndSubscription);
      }

      if (nextProps.serverUrl) {
        nextState.clientAndSubscription = connectAndSubscribe(
          nextProps.serverUrl,
          nextState.handleChange
        );
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
  }

  render() {
    const cc = this.state.clientAndSubscription;
    const result =
      this.state.clientState &&
      cc &&
      (this.props.render ? (
        this.props.render(
          this.state.clientState,
          cc.chatClient.sendText,
          cc.chatClient.tryLogin
        )
      ) : this.props.component ? (
        <this.props.component
          clientState={this.state.clientState}
          login={cc.chatClient.tryLogin}
          sendText={cc.chatClient.sendText}
        />
      ) : null) || null;

    return result;
  }

  componentWillUnmount() {
    if (this.state.clientAndSubscription) {
      disconnectAndUnsubscribe(this.state.clientAndSubscription);
    }
  }
}
