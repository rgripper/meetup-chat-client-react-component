import * as React from "react";
import { useEffect, useState, SFC } from "react";
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
  const subscription = chatClient.stateChanges.subscribe((d) => { console.log(d); handleChange(d) });
  return () => {
    chatClient.disconnect();
    subscription.unsubscribe();
  };
};

export interface InnerComponentProps {
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

export const ChatDataSource: SFC<Props> = (props) => {
  const { component, serverUrl, userName } = props;
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
    <props.component
      clientState={clientState}
      login={chatClient.tryLogin}
      sendText={chatClient.sendText}
    />
  );
}