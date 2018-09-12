import * as React from "react";
import { ClientState } from "meetup-chat-client";
import { Subscription } from "rxjs";
export declare class ChatDataSource extends React.PureComponent<{
    onChange: () => ClientState;
    serverUrl: string;
}> {
    subscribe: (onChange: () => ClientState, serverUrl: string) => Subscription;
    subscription: Subscription | undefined;
    getSnapshotBeforeUpdate(): void;
    private unsubscribe;
    componentWillUnmount(): void;
}
