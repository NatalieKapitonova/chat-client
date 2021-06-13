import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const NEW_USER_NAME_EVENT = "NEW_USER_EVENT";
// const socketServerUrl = "http://localhost:3040";
const socketServerUrl = "http://192.168.100.24:3040";

export interface User {
  id: number;
  name: string;
}

export interface Message {
  user: User;
  text: string;
  isOwner: boolean;
  messageType: MessageType;
}

export enum MessageType {
  user = 1,
  join = 2,
  leave = 3,
}

const useChat = (roomId: number) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef: any = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(socketServerUrl, {
      query: { roomId: roomId.toString() },
    });

    socketRef.current.on(
      NEW_USER_NAME_EVENT,
      (data: { users: User[]; messages: Message[] }) => {
        console.log(data.users);
        setUsers([...data.users]);
        setMessages([...data.messages]);
      }
    );

    socketRef.current.on(
      NEW_CHAT_MESSAGE_EVENT,
      (data: { messages: Message[] }) => {
        console.log(data.messages);
        // const incomingMessage = {
        //   ...message,
        //   ownedByCurrentUser: message.user.id === socketRef.current.id,
        //   messageType: MessageType.user,
        // };
        setMessages(
          data.messages.map((d) => ({
            ...d,
            isOwner: d.user.id === socketRef.current.id,
          }))
        );
      }
    );

    // socketRef.on('disconnect', )

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (text: string) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      text,
      user: {
        id: socketRef.current.id,
        name:
          users.find((u) => u.id === socketRef.current.id)?.name || "Unknown",
      },
    });
  };

  const declareUser = (userName: string) => {
    socketRef.current.emit(NEW_USER_NAME_EVENT, {
      id: socketRef.current.id,
      userName,
    });
  };

  const identifyUserName = (): User | null => {
    return users.find((u) => u.id === socketRef.current.id) || null;
  };

  return { messages, sendMessage, declareUser, identifyUserName };
};

export default useChat;
