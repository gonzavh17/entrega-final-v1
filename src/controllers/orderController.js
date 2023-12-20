/* import cartModel from "../models/cartModel.js";
import logger from "../utils/loggers.js";
import ticketController from "./ticketController.js";
import productModel from "../models/product.model.js";
import userModel from "../models/usersModel.js";


const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const email = req.user.email;
  try {
    const cart = await cartModel.findById(cid);
    const products = await productModel.find();

    if (!cart) {
      logger.warn(`Cart not found for user ${email}`);
      return res.status(404).send({ resultado: "Not Found", message: cart });
    }

    let totalAmount = 0;
    const purchaseItems = [];

    for (const item of cart.products) {
      const product = products.find(
        (prod) => prod._id == item.id_prod.toString()
      );
      if (product.stock >= item.quantity) {
        if (userModel.role === "premium") {
          totalAmount += product.price * item.quantity * 0.8;
        } else {
          totalAmount += product.price * item.quantity;
        }
        product.stock -= item.quantity;
        await product.save();
        purchaseItems.push(product.title);
      }
    }

    // Llamada a createTicket
    const generatedTicket = await ticketController.createTicket({
      body: {
        amount: totalAmount,
        purchaser: email,
      },
    });

    await cartModel.findByIdAndUpdate(cid, { products: [] });

    logger.info(`Purchase successful for user ${email}`);
    res.status(201).send({
      response: "Compra exitosa",
      amount: totalAmount,
      items: purchaseItems,
      ticket: generatedTicket,
    });
  } catch (error) {
    logger.error(`Error al procesar compra para usuario ${email}: ${error}`);
    res.status(400).send({ error: `Error al procesar compra: ${error}` });
  }
};


const orderController = {
    purchaseCart
}

export default orderController */