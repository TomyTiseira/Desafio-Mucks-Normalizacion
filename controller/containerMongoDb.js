import Message from "../model/index.js";

class ContainerMongoDb {
  addMessage = async (messageToAdd) => {
    const message = new Message(messageToAdd);

    await message.save();
  };

  getMessages = async () => await Message.find({});
}

const containerMongoDb = new ContainerMongoDb();

export default containerMongoDb;
