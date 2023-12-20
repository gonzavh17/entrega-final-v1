import cartModel from "../models/cartModel.js";
import userModel from "../models/usersModel.js";
import productModel from "../models/product.model.js";
import ticketController from "./ticketController.js";
import logger from "../utils/loggers.js";



// Get cart
const getCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      logger.info(cart);
      res.status(200).send({ resultado: "OK", message: cart });
    } else {
      logger.warn(`Cart with : ${cid}, not found`);
      res
        .status(404)
        .send({ resultado: "Error", message: `Cart with : ${cid}, not found` });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: `Error al consultar productos ${error}` });
  }
};

// Post product in cart
const postProductInCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      const existingProductIndex = searchCart.products.findIndex(
        (product) => product.id_prod.toString() === pid
      );

      if (existingProductIndex !== -1) {
        const existingProduct = searchCart.products[existingProductIndex];
        existingProduct.quantity += 1;
      } else {
        searchCart.products.push({ id_prod: pid, quantity: 1 });
      }

      const updatedCart = await searchCart.save();

      res.status(200).send({
        result: "OK",
        message: "Producto agregado exitosamente",
        cart: updatedCart,
      });
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ error: `Error al añadir producto: ${error}` });
  }
};

// Put quantity
const putQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      const productIndex = searchCart.products.findIndex(
        (product) => product.id_prod.toString() === pid
      );

      if (productIndex !== -1) {
        searchCart.products[productIndex].quantity = quantity;

        const updatedCart = await searchCart.save();

        logger.info('Product successfully updated')
        res.status(200).send({
          result: "OK",
          message: "Product quantity",
          cart: updatedCart,
        });
      } else {
        logger.warn('Product not found in cart')
        res.status(404).send({ error: "Product not found in cart'" });
      }
    } else {
        logger.warn('Cart not found')
      res.status(404).send({ error: "Cart not found" });
    }
  } catch (error) {
    res
      .status(400)
      .send({ error: `Error while updating products in cart: ${error}` });
  }
};


// Delete product from cart
const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      const existingProductIndex = searchCart.products.findIndex(
        (product) => product.id_prod.toString() === pid
      );

      if (existingProductIndex !== -1) {
        searchCart.products.splice(existingProductIndex, 1);
        await searchCart.save();

        logger.info('Product successfully eliminated')
        res.status(200).send({
          result: "OK",
          message: "Product successfully eliminated",
          cart: searchCart,
        });
      } else {
        res.status(404).send({
          resultado: "Product not found",
          message: searchCart,
        });
      }
    } else {
        logger.warn('Cart not found')
      res.status(404).send({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar producto: ${error}` });
  }
};

const clearCart = async (req, res) => {
    const {cid} = req.params

    try {

        const cart = cartModel.findById(cid)

        if(!cart) {
            logger.warn(`Cart not found ${cid}`)
            res.status(404).send({ resultado: 'Error', message: `No se encontró el carrito con el ID: ${cid}` })
        }

        cart.products = []

        await cart.save()

        logger.info(`Cart successfully clear: ${cid}`);
        res.status(200).send({ resultado: 'OK', message: 'Cart successfully clear:' });
    } catch (error) {
        logger.error(`Error while clear cart ${error}`)
        res.status(500).send({message: `Error while clear cart ${error}`})
    }
}

const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const email = req.user.email;
  try {
    const cart = await cartModel.findById(cid);
    const products = await productModel.find();

    if (!cart) {
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
          amount += price * quantity * 0.8;
        } else {
          amount += price * quantity;
        }
        product.stock -= item.quantity;
        await product.save();
        purchaseItems.push(product.title);
      }
    }

    const generatedTicket = await ticketController.createTicket(
      {
        body: {
          amount: totalAmount,
          email: email,
        },
      },
      res
    );

    await cartModel.findByIdAndUpdate(cid, { products: [] });

    res.status(201).send({
      response: "Compra exitosa",
      amount: totalAmount,
      items: purchaseItems,
      ticket: generatedTicket,
    });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar carrito: ${error}` });
  }
};



const cartController = {
  getCart,
  postProductInCart,
  putQuantity,
  deleteProductFromCart,
  clearCart,
  purchaseCart
};

export default cartController;
