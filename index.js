import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import { connectToDb, dbDAO } from "./config/connectToDb.js";
import { normalizer } from "./utils/normalizr.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const db = "firebase";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Messages array initialization.
// let messagesArray = [];

app.get("/", (req, res) => {
  res.render("products");
});

io.on("connection", async (client) => {
  const messagesArray = (await dbDAO.getMessages()) || [];

  const normalizedData = normalizer(messagesArray);

  console.log(JSON.stringify(normalizedData, null, 2));

  // Send all messages from messages array
  client.emit("messages", normalizedData);

  // Receive a message.
  client.on("new-message", async (message) => {
    const date = new Date().toLocaleString();

    try {
      // Add message in DataBase.
      await dbDAO.addMessage({ ...message, date });
      messagesArray.messages.push({ ...message, date });
    } catch (e) {
      console.log(e.message);
    }

    // Send the new message.
    io.sockets.emit("message-added", { ...message, date });
  });
});

app.use("/api/productos-test", productTestRouter);

connectToDb(db).then(() => server.listen(8080));
