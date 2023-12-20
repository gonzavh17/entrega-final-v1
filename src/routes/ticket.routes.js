import { Router } from "express";
import ticketController from "../controllers/ticketController.js";

const ticketRouter = Router()

ticketRouter.get('/', ticketController.getTickets)
ticketRouter.get('/create', ticketController.createTicket)

export default ticketRouter