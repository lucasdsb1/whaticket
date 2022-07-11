import { Message as WbotMessage } from "whatsapp-web.js";
import Ticket from "../models/Ticket";
import GetTicketWbot from "./GetTicketWbot";
import AppError from "../errors/AppError";
import Message from "../models/Message";
import { getIO } from "../libs/socket";

export const GetWbotMessage = async (
  ticket: Ticket,
  messageId: string
): Promise<WbotMessage> => {
  const wbot = await GetTicketWbot(ticket);

  const wbotChat = await wbot.getChatById(
    `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`
  );

  let limit = 20;

  const fetchWbotMessagesGradually = async (): Promise<void | WbotMessage> => {
    const chatMessages = await wbotChat.fetchMessages({ limit });

    const msgFound = chatMessages.find(msg => msg.id.id === messageId);

    if (!msgFound && limit < 100) {
      limit += 20;
      return fetchWbotMessagesGradually();
    }

    return msgFound;
  };

  try {
    const msgFound = await fetchWbotMessagesGradually();

    if (!msgFound) {
      throw new Error("Cannot found message within 100 last messages");
    }

    return msgFound;
  } catch (err) {
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      throw new AppError("ERR_FETCH_WAPP_MSG");
    }
    
    if (await message!.update({ isDeleted: true })) {
      message.isDeleted = true;
    }
      
    const io = getIO();
    io.to(message!.ticketId.toString()).emit("appMessage", {
      action: "update",
      message
    });

    throw new AppError("ERR_CONTACT_MSG_DELETED");
  }
};

export default GetWbotMessage;
