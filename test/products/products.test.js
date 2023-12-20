// Dependencies
import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../../src/utils/loggers.js";
import 'dotenv/config';

//Models
import productModel from "../../src/models/product.model.js";
import { after } from "mocha";

const expect = chai.expect;
const requester = supertest(process.env.APP_URL + process.env.APP_PORT);

await mongoose.connect(process.env.MONGO_URL)
    .then(() => logger.info('Conectado a la BDD Mongo (test mode)'))
    .catch(error => logger.error('Error al conectar a la BDD Mongo (test mode): ' + error));

describe('Testing de productos en Tienda Online', function () {
    let token = "";
    let getProductCreated = null;
    before(async function () {
        this.timeout(7000);
        getProductCreated = await productModel.findOne({ code: "HP1234" });
        const response = await requester.post('/api/sessions/login')
            .send({
                email: process.env.EMAIL_DIRECTION,
                password: process.env.EMAIL_PASSWORD
            });
        //Get cookie from response
        const cookie = response.headers['set-cookie'][0];
        token = cookie.split(';')[0].split('=')[1];
        console.log(token)
    });

    describe('Test de productos', function () {
        it('Test endpoint: GET /api/products/, se espera un array de productos', async () => {
            const response = await requester.get('/api/products/');
            expect(response.body.message.docs).to.be.an('array');
        });
    });
    describe('Test de productos', function () {
        it('Test endpoint: GET /api/products/:id, se espera un producto', async () => {
            const response = await requester.get('/api/products/6501bde46f766330b7fea83f');
            expect(response.body.message).to.be.an('object');
        });
    });
    describe('Test de productos', async function () {
        it('Test endpoint: POST /api/products/, se espera agregar un producto nuevo', async function () {
            try {
                const response = await requester.post('/api/products/')
                    .set("Cookie", `jwtCookie=${token}`)
                    .send({
                        title: "Test Product",
                        description: "This product has been created for testing purposes",
                        price: 100,
                        stock: 10,
                        thumbnail: ["https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-512.png"],
                        code: "Test123",
                        category: "Test"
                    });
                    console.log('Respuesta de la API:', response.body);
                expect(response.body.message).to.be.an('object');
            } catch (error) {
                logger.error("ERROR: ", error);
                throw error;
            }
        });
    });
    describe('Test de productos', async function () {
        it('Test endpoint: PUT /api/products/:id, se espera actualizar un producto', async () => {
            const response = await requester.put(`/api/products/${getProductCreated._id}`)
                .set("Cookie", `jwtCookie=${token}`)
                .send({
                    price: Math.floor(Math.random() * 100),
                    stock: Math.floor(Math.random() * 20),
                });
            expect(response.body.message).to.be.an('object');
        });
    });
    after(async function () {
        try {
            await productModel.deleteOne({ code: "Test123" });
            logger.info("Test product deleted");
        } catch (error) {
            logger.error("ERROR during cleanup: ", error);
            throw error;
        }
    });
});