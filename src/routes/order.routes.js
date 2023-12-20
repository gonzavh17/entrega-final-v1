/* import { Router } from "express";
import orderController from "../controllers/orderController.js";
import passport from "passport";

const orderRouter = Router()

orderRouter.post(
    "/:cid/purchase",
    passport.authenticate("jwt", { session: false }),
    orderController.purchaseCart
  );

export default orderRouter */