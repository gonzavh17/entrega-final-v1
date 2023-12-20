import { Router } from "express";
import cartsController from "../controllers/cartController.js";
import cartController from "../controllers/cartController.js";
import passport from "passport";

const cartRouter = Router();

cartRouter.get("/:cid", cartsController.getCart);
cartRouter.post("/:cid/products/:pid", cartsController.postProductInCart);
cartRouter.put("/:cid/products/:pid", cartsController.putQuantity);
cartRouter.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);
cartRouter.post('/clear', cartController.clearCart)
cartRouter.post(
    "/:cid/purchase",
    passport.authenticate("jwt", { session: false }),
    cartController.purchaseCart
  );


export default cartRouter;