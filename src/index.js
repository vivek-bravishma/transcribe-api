const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new socketIO.Server(server, {
  cors: {
    origin: "*",
  },
});

app.post("/webhook", (req, res) => {
  const data = req.body;
  console.log(data);

  if (connectedClient) {
    connectedClient.emit("data", data);
  }

  res.sendStatus(200);
});

let connectedClient = null;

io.on("connection", (socket) => {
  connectedClient = socket;
  // console.log("new connection==> ", connectedClient);

  socket.on("disconnect", () => {
    connectedClient = null;
    console.log("client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
