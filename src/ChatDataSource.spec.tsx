import React from "react";

import { ChatDataSource } from "./ChatDataSource";
import { shallow, mount } from "enzyme";
import { ClientState } from "meetup-chat-client";

describe("<ChatDataSource />", () => {
  const serverUrl = "http://localhost:35558";

  it("should connect and call onChange", done => {
    const render = jest.fn((state: ClientState) => (
      <div>{state.chat.isAuthenticated.toString()}</div>
    ));
    const renderedElement = mount(<ChatDataSource serverUrl={serverUrl} render={render} />);

    setTimeout(() => {
      expect(renderedElement.html()).toBe('<div>false</div>');
      expect(render).toBeCalledTimes(1);
      expect(render).toHaveBeenLastCalledWith({
        socket: { isConnected: true, isConnecting: false },
        chat: { isAuthenticated: false }
      }, expect.any(Function), expect.any(Function));
      done();
    }, 500);
  });

  it("should login and call onChange", done => {
    const userName = "Harry";
    const render = jest.fn((_state, login) => (
      <button onClick={() => login(userName)}>Login</button>
    ));
    const renderedElement = mount(
      <ChatDataSource serverUrl={serverUrl} render={render} />
    );

    setTimeout(() => {
      console.log(renderedElement);
      renderedElement.simulate("click");
      setTimeout(() => {
        expect(render).toBeCalledTimes(3);
        done();
      }, 500);
    }, 500);
  });
});
