import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Input, Button, Link } from "@material-ui/core";

export default () => {
  const [roomId, setRoomId] = useState<number | null>(null);

  const history = useHistory();
  const handleEnterRoom = () => {
    history.push(`/${roomId}/room`);
  };

  return (
    <Container
      maxWidth="sm"
      style={{ textAlign: "center", verticalAlign: "middle", paddingTop: 100 }}
    >
      <Input
        value={roomId}
        onChange={(v) => setRoomId(Number(v.currentTarget.value))}
      />
      <br />
      <br />
      <Button
        onClick={handleEnterRoom}
        variant="outlined"
        color="primary"
        disabled={!roomId}
      >
        Join Room
      </Button>
      <Button
        onClick={handleEnterRoom}
        variant="outlined"
        color="primary"
        disabled={!roomId}
      >
        Create Room
      </Button>
    </Container>
  );
};
