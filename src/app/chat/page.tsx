"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Chat() {
  const [chat, setChat] = useState<string[]>([]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    const onDisconnect = () => {
      setChat((prev) => [...prev, "'DISCONNECTED'"]);
    };
    const onConnect = () => {
      setChat((prev) => [...prev, "'CONNECTED'"]);
    };
    const updateChat = (msg: string) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", updateChat);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", updateChat);
    };
  }, []);

  const connectSocket = () => {
    socket.connect();
  };
  const disconnectSocket = () => {
    socket.disconnect();
  };
  const addMessage = (msg: string) => {
    socket.emit("chat message", msg);
  };

  const messages = chat.map((e, i) => {
    return <li key={i}>{e}</li>;
  });

  return (
    <>
      <h1>Chat App</h1>
      <button onClick={connectSocket}>Connect</button>
      <button onClick={disconnectSocket}>Disconnect</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMsgInput("");
          addMessage(msgInput);
        }}
      >
        <input onChange={(e) => setMsgInput(e.target.value)} value={msgInput} />
        <button type="submit">Send</button>
      </form>
      <ul>{messages}</ul>
    </>
  );
}
