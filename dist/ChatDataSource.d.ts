import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import { Subscription } from "rxjs";
interface ClientAndSubscription {
    chatClient: ChatClient;
    subscription: Subscription;
}
interface Props {
    render?: (clientState: ClientState, login: (userName: string) => any, sendText: (text: string) => any) => React.ReactNode;
    serverUrl?: string;
}
declare type State = Props & {
    clientState?: ClientState;
    handleChange: (state: ClientState) => any;
    clientAndSubscription?: ClientAndSubscription;
};
export declare class ChatDataSource extends React.PureComponent<Props, State> {
    state: State;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null;
    render(): {} | null | undefined;
    componentWillUnmount(): void;
}
export {};
