import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
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
export declare class ChatDataSource extends React.PureComponent<Props, State> {
    state: State;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null;
    render(): null;
    componentWillUnmount(): void;
}
export {};
