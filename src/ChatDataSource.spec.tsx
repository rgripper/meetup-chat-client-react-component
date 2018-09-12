import * as React from "react";
import { ChatClient, ClientState } from "meetup-chat-client";
import memoizeOne from "memoize-one";
import { Subscription } from "rxjs";

export class ChatDataSource extends React.PureComponent<{
  onChange: () => ClientState;
  serverUrl: string;
}> {
  subscribe = memoizeOne((onChange: () => ClientState, serverUrl: string) =>
    ChatClient.connect(serverUrl).stateChanges.subscribe(onChange)
  );

  subscription: Subscription | undefined;

  getSnapshotBeforeUpdate() {
    const subscription = this.subscribe(
      this.props.onChange,
      this.props.serverUrl
    );
    if (this.subscription !== subscription) {
      this.unsubscribe();
      this.subscription = subscription;
    }
  }

  private unsubscribe() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}
