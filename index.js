import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productTestRouter from "./routes/productos-test.js";
import { dbDAO } from "./config/connectToDb.js";
import { denormalizer, normalizer } from "./utils/normalizr.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("chat");
});

io.on("connection", async (client) => {
  const messagesArray = (await dbDAO.getMessages()) || [];

  const normalizedData = normalizer(messagesArray);

  // console.log(JSON.stringify(normalizedData, null, 2));

  const denormalizedData = denormalizer(normalizedData);

  // console.log(JSON.stringify(denormalizedData, null, 2));

  if (denormalizedData?.messages[0]?._doc) {
    let data = {
      id: "1",
      messages: [],
    };

    denormalizedData.messages.forEach((message) => {
      data.messages.push(message._doc);
    });

    // Send all messages
    client.emit("messages", data);
  } else {
    // Send all messages
    client.emit("messages", denormalizedData);
  }

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

server.listen(8080);
