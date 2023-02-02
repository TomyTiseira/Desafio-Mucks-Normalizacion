import containerArchivo from "../controller/containerArchivo.js";

class ArchivoDAO {
  addMessage = async (messageToAdd) => {
    const messages = await this.getMessages();

    if (!messages) {
      await containerArchivo.addMessage([
        JSON.stringify([{ ...messageToAdd, id: "0" }], null, 2),
      ]);
      return;
    }

    messageToAdd.id = messages.length.toString();

    await containerArchivo.addMessage(
      JSON.stringify([...messages, messageToAdd], null, 2)
    );
  };

  getMessages = async () => {
    let messages = await containerArchivo.getMessages();

    if (messages.length > 0) {
      messages = JSON.parse(messages);
    }

    return messages;
  };
}

export default ArchivoDAO;
