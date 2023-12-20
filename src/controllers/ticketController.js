import ticketModel from "../models/ticketModel.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/loggers.js";

const getTickets = async (req, res) => {
  try {
    const findTicket = await ticketModel.find();

    res.status(200).send({ response: findTicket });
  } catch (error) {
    res.status(500).send({ message: `Error al consultar ticket ${error}` });
  }
};

const createTicket = async (req, res) => {
  const { amount, email } = req.body;
  try {
    const ticket = {
      code: uuidv4(),
      amount: amount,
      purchaser: email,
    };
    await ticketModel.create(ticket);
    const generatedTicket = await ticketModel.findOne({ code: ticket.code });
    /* logger.info(generatedTicket);
    res.status(201).send(generatedTicket); */
  } catch (error) {
    logger.error(`Error al generar ticket: ${error}`);
    res.status(500).send({ message: `Error al crear ticket ${error}` });
  }
};


const ticketController = { createTicket, getTickets };
export default ticketController;
