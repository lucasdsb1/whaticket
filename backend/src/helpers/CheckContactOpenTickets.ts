import { Op } from "sequelize";
import AppError from "../errors/AppError";
import Queue from "../models/Queue";
import Ticket from "../models/Ticket";
import User from "../models/User";

const CheckContactOpenTickets = async (contactId: number): Promise<void> => {
  const ticket = await Ticket.findOne({
    where: { contactId, status: { [Op.or]: ["open", "pending"] } }
  });

  if (ticket) {
    const user = await User.findOne({
      where: { id: ticket.userId }
    })

    const queue = await Queue.findOne({
      where: { id: ticket.queueId }
    });
    
    throw new AppError(
      "ERR_OTHER_OPEN_TICKET", 
      400, 
      {
        user: user?.name,
        queue: queue?.name
      }
    );
  }
};

export default CheckContactOpenTickets;
