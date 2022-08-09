import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { onJoin, onLeave } from "./whatsapp-auth";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: true },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("authenticate", async ({ userUid }) => {
    if (!userUid) {
      return;
    }
    socket.data.userUid = userUid;

    onJoin(userUid, socket);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected ${socket.data.userUid}`, reason);
    onLeave(socket.data.userUid, socket);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
