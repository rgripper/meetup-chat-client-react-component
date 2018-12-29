import * as React from "react";
import { useEffect, useState } from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import { Subscription } from "rxjs";

interface ClientAndSubscription {
  chatClient: ChatClient;
  subscription: Subscription;
}

const connectAndSubscribe = (
  serverUrl: string,
  setChatClient: (chatClient: ChatClient) => any,
  handleChange: (clientState: ClientState) => any
) => {
  const chatClient = ChatClient.connect(serverUrl);
  setChatClient(chatClient);
  const subscription = chatClient.stateChanges.subscribe(handleChange);
  return () => {
    chatClient.disconnect();
    subscription.unsubscribe();
  };
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
  component: React.ComponentType<InnerComponentProps>;
  serverUrl?: string;
  userName?: string;
}

type State = Props & {
  clientState?: ClientState;
  chatClient?: ChatClient;
  clientAndSubscription?: ClientAndSubscription;
};

export class ChatDataSource extends React.PureComponent<Props, State> {
  render() {
    const { component, serverUrl, userName } = this.props;
    const [clientState, setClientState] = useState<ClientState | undefined>(
      undefined
    );
    const [chatClient, setChatClient] = useState<ChatClient | undefined>(
      undefined
    );

    if (serverUrl) {
      useEffect(
        () => connectAndSubscribe(serverUrl, setChatClient, setClientState),
        [serverUrl, component, serverUrl, userName]
      );
    }

    if (!clientState || !chatClient) {
      return null;
    }

    return (
      <this.props.component
        clientState={clientState}
        login={chatClient.tryLogin}
        sendText={chatClient.sendText}
      />
    );
  }
}
