import { useState, useEffect } from "react";
import io from "socket.io-client";

export const useSocketConnection = (serverUrl) => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl, {
      transports: ["websocket"],
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [serverUrl]);

  return { connected, socket };
};
