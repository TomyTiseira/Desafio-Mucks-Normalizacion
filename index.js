import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import { connectToDb, dbDAO } from "./config/connectToDb.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const db = "mongo";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Messages array initialization.
let messages = [];

app.get("/", (req, res) => {
  res.render("products");
});

io.on("connection", async (client) => {
  messages = await dbDAO.getMessages();

  // Send all messages from messages array
  client.emit("messages", messages);

  // Receive a message.
  client.on("new-message", async (message) => {
    const date = new Date().toLocaleString();

    try {
      // Add message in DataBase.
      await dbDAO.addMessage({ ...message, date });
      messages.push({ ...message, date });
    } catch (e) {
      console.log(e.message);
    }

    // Send the new message.
    io.sockets.emit("message-added", { ...message, date });
  });
});

app.use("/api/productos-test", productTestRouter);

connectToDb(db).then(() => server.listen(8080));
