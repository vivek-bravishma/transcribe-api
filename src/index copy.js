const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const port = 5154;
const userSockets = new Map();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new socketIO.Server(server, {
	cors: {
		origin: "*",
	},
});

let connectedClient = [];

app.get("/", (req, res) => {
	res.send("Api working");
});

app.post("/webhook", (req, res) => {
	const data = req.body;
	// console.log(data);

	if (connectedClient) {
		connectedClient.emit("data", data);
		console.log("connected clients==> ", connectedClient.id);
	}

	// const userSocket = userSockets.get(user_id);
	// if (userSocket) userSocket.emit("data", data);

	res.sendStatus(200);
});

app.get("/webhook/reset", (req, res) => {
	console.log("reset called");
	if (connectedClient) {
		connectedClient.emit("reset");
	}

	res.sendStatus(200);
});

io.on("connection", (socket) => {
	connectedClient.push(socket);
	// console.log("new connection==> ", connectedClient);

	const userId = socket.handshake.query.userId;

	console.log("client connected=> ", userId);

	userSockets.set(userId, socket);

	socket.on("setUserId", (userId) => console.log("usr==> ", userId));

	socket.on("disconnect", () => {
		connectedClient = [];
		console.log("client disconnected");
		userSockets.delete(userId);
	});
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
