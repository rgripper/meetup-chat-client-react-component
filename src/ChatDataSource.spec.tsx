import React, { SFC } from "react";

import { ChatDataSource, InnerComponentProps } from "./ChatDataSource";
import { shallow, mount } from "enzyme";

describe("<ChatDataSource />", () => {
  const serverUrl = "http://localhost:35558";

  it("should connect and call onChange", done => {
    const component: SFC<InnerComponentProps> = props => (
      <div>{props.clientState.chat.isAuthenticated.toString()}</div>
    );
    const renderedElement = mount(<ChatDataSource serverUrl={serverUrl} component={component} />);

    setTimeout(() => {
      renderedElement.update();
      expect(renderedElement.html()).toBe('<div>false</div>');
      const innerProps = renderedElement.find(component).props();
      expect(innerProps).toMatchObject({
        clientState: {
          socket: { isConnected: true, isConnecting: false },
          chat: { isAuthenticated: false }
        },
        login: expect.any(Function),
        sendText: expect.any(Function)
      });
      done();
    }, 500);
  });

  // it("should login and call onChange", done => {
  //   const userName = "Harry";

  //   const component = jest.fn((props: { clientState: ClientState, login: any }) => (
  //     <button onClick={() => props.login(userName)}>Login</button>
  //   ));

  //   const renderedElement = mount(
  //     <ChatDataSource serverUrl={serverUrl} component={component} />
  //   );

  //   setTimeout(() => {
  //     console.log(renderedElement);
  //     renderedElement.update();
  //     renderedElement.simulate("click");
  //     done();
  //   }, 500);
  // });
});
