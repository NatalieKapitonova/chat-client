import React, { useState, useRef, useEffect } from "react";

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Input,
  Button,
  Container,
  Paper,
  Avatar,
} from "@material-ui/core";

import chatSocket, { User, Message, MessageType } from "../interface/data";

export default (props: { match: { params: { id: string } } }) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const { messages, sendMessage, identifyUserName, declareUser } = chatSocket(
    Number(id)
  );
  const [user, setUser] = useState<Pick<User, "name"> | null>(
    identifyUserName()
  );
  const [userName, setUserName] = useState<string>("");

  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageChange = (event: any) => {
    setNewMessage(event.currentTarget.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return (
      <Container
        maxWidth={"sm"}
        style={{ textAlign: "center", paddingTop: 200 }}
      >
        <Input
          placeholder="Please enter your name"
          value={userName}
          onChange={(e) => setUserName(e.currentTarget.value)}
          style={{ width: "50%" }}
        />
        <br />
        <br />
        <Button
          onClick={() => {
            setUser({ name: userName });
            declareUser(userName);
          }}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth={"md"}>
      <Typography variant="h5" color="textSecondary">
        Room #{id}
      </Typography>
      <br />
      <br />

      <>
        <Paper style={{ height: 850, overflow: "auto", padding: 10 }}>
          <List style={{ maxHeight: 200 }}>
            {messages.map((message, i) => (
              <ListItem
                key={i}
                style={{
                  backgroundColor:
                    message.isOwner && message.messageType === MessageType.user
                      ? "#caf0f8"
                      : "inherit",
                }}
              >
                {message.messageType === MessageType.user && (
                  <ListItemAvatar>
                    <Avatar>{message.user.name.substr(0, 1)}</Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText
                  style={{
                    textAlign:
                      message.messageType === MessageType.join
                        ? "center"
                        : message.isOwner
                        ? "right"
                        : "left",
                  }}
                  primary={
                    message.messageType === MessageType.user &&
                    !message.isOwner && (
                      <i
                        style={{
                          color: "gray",
                          fontWeight: "lighter",
                          fontSize: "0.8em",
                        }}
                      >
                        {message.user.name}
                      </i>
                    )
                  }
                  secondary={<p>{message.text}</p>}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Paper>
      </>

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          textAlign: "center",
          width: "70%",
          left: 50,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Input
          fullWidth
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyPress={(e) => {
            console.log(e.key);
            e.key === "Enter" && handleSendMessage();
          }}
        />
        &nbsp;&nbsp;
        <Button
          onClick={handleSendMessage}
          disabled={newMessage === ""}
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </div>
    </Container>
  );
};
