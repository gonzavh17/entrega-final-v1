import { Router } from "express";
import productRouter from "./product.routes.js";
import cartRouter from "./cart.routes.js";
import sessionRouter from "./sessions.routes.js";
/* mport orderRouter from "./order.routes.js"; */
import ticketRouter from "./ticket.routes.js";
const router = Router()

router.use('/api/products', productRouter)
router.use('/api/cart', cartRouter)
router.use('/api/sessions', sessionRouter)
/* router.use('/api/order', orderRouter) */
router.use('/api/ticket', ticketRouter)

export default router