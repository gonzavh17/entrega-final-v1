import router from "./routes/index.routes.js";
import express from 'express'
import "dotenv/config.js";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from "express-session";
import initializePassport from "./config/passport.js";
import passport from "passport";
import errorHandler from "./middlewares/errorHandler.js";

// Variables
const app = express();
const PORT = process.env.APP_PORT

// Server
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Conexion con Mongo
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error in MongoDB Atlas conection ", error);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(session({
  secret: process.env.SESSIONS_SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 600
  })
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).send({ message: 'Error interno del servidor' });
});
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(400).json({ error: 'BadRequest', message: err.message });
});

app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).send({ message: 'Error interno del servidor' });
});

// Rutas
app.use('/', router)


// Mensaje de error
app.get("*", (req, res) => {
  res.status(404).send("Error 404");
});

app.use(errorHandler)