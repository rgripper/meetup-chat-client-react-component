import React from "react";

import { ChatDataSource } from "./ChatDataSource";
import { shallow, mount } from "enzyme";

describe("<ChatDataSource />", () => {
  const serverUrl = "http://localhost:35558";

  it("should connect and call onChange", done => {
    const onChange = jest.fn();
    const foo = mount(
      <ChatDataSource serverUrl={serverUrl} onChange={onChange} />
    );

    setTimeout(() => {
      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith({
        socket: { isConnected: true, isConnecting: false },
        chat: { isAuthenticated: false }
      });
      done();
    }, 2000);
  });

  it("should login and call onChange", done => {
    const onChange = jest.fn();
    const userName = "Harry";
    const foo = mount(
      <ChatDataSource serverUrl={serverUrl} onChange={onChange} userName={userName} />
    );

    setTimeout(() => {
      expect(onChange).toBeCalledTimes(4);
      expect(onChange.mock.calls.some(args => args[0].chat.users && args[0].chat.users.some(u => u.name === userName))).toBeTruthy()
      done();
    }, 2000);
  });
});
