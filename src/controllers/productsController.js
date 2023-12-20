import productModel from "../models/product.model.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/customErrors.js"
import logger from "../utils/loggers.js";

// Get product
const getProducts = async(req, res) => {
    const {limit, page, sort, category, status} = req.query
    let sortOption
    sort === 'asc' && (sortOption = 'price')
    sort === 'desc' && (sortOption = '-price')

    const options = {
        limit: limit || 10,
        page: page || 1,
        sort: sortOption || null
    }

    const query = {};
	category && (query.category = category);
	status && (query.status = status);

	try {
		const prods = await productModel.paginate(query, options);

		res.status(200).send({ resultado: 'OK', message: prods });
        logger.info(JSON.stringify(prods))
	} catch (error) {

		res.status(400).send({ error: `Error al consultar productos: ${error}` });
        logger.error(error)
	}
}

// Get product by ID
const getProductByID = async(req, res) => {
    const {pid} = req.params

    try{
        const product = await productModel.findById(pid)
        if (product) {
            res.status(200).send({result: 'OK', message: product})
            logger.info('Product:', product)
        } else {
            res.status(404).send({ result: 'Not found' })
            logger.info('Product not found')
        }

    } catch (error) {
        res.status(500).send(`Error while retrieving products ${error}` )
        logger.error('Error while retrieving products', error)
    }
}

// Post product
const createProduct = async (req, res) => {
    const { title, description, price, thumbnail, stock, code, category, status } = req.body

    try {
        const product = await productModel.create({
            title, 
            description, 
            price, 
            thumbnail, 
            stock, 
            code, 
            category, 
            status
        })
        res.status(201).send({result: 'OK', message: 'Product succesfully created'})
        logger.info('Producto creado correctamente:', product);
    } catch(error) {
        res.satus(500).send({error : `Internal error ${error}`})
        logger.error(error)
    }
}

// Delete
const deleteProduct = async (req, res) => {
    const { pid } = req.params

    try{
        const product = await productModel.findByIdAndDelete(pid)
        if(product){
            res.status(200).send({result: 'OK', message: `Product succesfully eliminated ${product}`})
            logger.info('Producto eliminado: ', product)
        } else {
            res.status(404).send({result: 'Not found', message: product})
            logger.info('Prdocuct not found')
        }
    } catch (error) {
        res.status(500).send({error: `Internal error ${error}`})
        logger.error(error)
    }
}

// Put product
const putProduct = async(req, res) => {
    const { pid } = req.params
    const { title, description, price, thumbnail, stock, code, category, status } = req.body

    try{
        const product = await productModel.findByIdAndDelete(pid, {
            title, 
            description, 
            price, 
            thumbnail, 
            stock, 
            code, 
            category, 
            status
        })

        if(product) {
            res.status(200).send({result: 'OK', message: `Product succesfully updated ${product}`})
            logger.info('Updated product: ', product)
        } else {
            res.status(500).send({result: 'Not found', message : pid})
            logger.error('Not found')
        }
    } catch (error) {
        res.status(500).send({result: 'Internal error', message: error})
        logger.error(error)
    }   
}

// Validate product data
const validateProductData = async (req, res, next) => {
    const { title, description, price, thumbnail, stock, code, category, status } = req.body

    try{
        if(!title || !description || !price || thumbnail || stock || code  || category || status) {
            CustomError.createError({
                name: "Product creation error",
                cause: generateProductErrorInfo({ title, description, price, stock, code, category }),
                message: "One or more properties were incomplete or not valid.",
                code: EErrors.INVALID_PRODUCT_ERROR
            })
        }
    } catch (error) {
        next(error)
        logger.error(error)
    }
}

const productsController = {
    createProduct,
    getProducts,
    getProductByID,
    deleteProduct,
    putProduct,
    validateProductData

}

export default productsController