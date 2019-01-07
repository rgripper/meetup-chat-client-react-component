import * as React from "react";
import { SFC } from "react";
import { ClientState } from "meetup-chat-client";
export interface InnerComponentProps {
    clientState: ClientState;
    login: (userName: string) => any;
    sendText: (text: string) => any;
}
interface Props {
    render?: (clientState: ClientState, login: (userName: string) => any, sendText: (text: string) => any) => React.ReactNode;
    component: React.ComponentType<InnerComponentProps>;
    serverUrl?: string;
    userName?: string;
}
export declare const ChatDataSource: SFC<Props>;
export {};
