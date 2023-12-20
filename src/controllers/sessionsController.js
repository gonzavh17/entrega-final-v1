import { generateToken } from "../utils/jwt.js";
import logger from "../utils/loggers.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/customErrors.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

const register = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn('Error registering user')
            res.status(401).send({error: 'Error registering user'})
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        logger.info('Cookie generated ', token)
        res.status(200).send({ payload: req.user })
    } catch (error) {
        logger.error(`Error creating user: ${error}`)
        res.status(500).send({ message: `Error creating user: ${error}`})
    }
}

const login = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn('Invalid credentials. Unable to log in.')
            res.status(401).send({ error: `Invalid credentials. Unable to log in.` });
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        };

        const token = generateToken(req.user);

        // Establecer la cookie del token JWT
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        });

        logger.info(`User ${req.user.email} sucessfully login.`);
        res.status(200).send({ payload: req.user });
    } catch (error) {
        logger.error(`Error logging in: ${error}`);
        res.status(500).send({ mensaje: `Error logging in: ${error}` });
    }
}

const validateUserData = (req, res, next) => {
    logger.info('Validating user data');
    const { first_name, last_name, email } = req.body;

    try {
        if (!last_name || !first_name || !email) {
            const error = CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo({ first_name, last_name, email }),
                message: "One or more properties were incomplete or not valid.",
                code: EErrors.INVALID_USER_ERROR
            });

            console.log("Error object:", error);
            throw error;  // Asegúrate de que esta línea se ejecuta solo cuando hay un error.
        }

        next();  // Asegúrate de que esta línea se ejecuta solo cuando no hay errores.
    } catch (error) {
        next(error);
    }
};

const getCurrentSession = async(req, res) => {
    res.status(200).send(req.user)
}

const getGithubCreateUser = async(req, res) => {
    res.status(200).send({ mensaje: 'Usuario creado' })
}

const getGithubSessions = async(req, res) => {
    req.session.user = req.user
    res.redirect('/static/home');
}

const logout = async(req, res) => {
    if (req.session.user) {
        try {
            req.session.destroy()
            res.clearCookie('jwtCookie')
            res.status(200).send({ resultado: 'Has cerrado sesion' })
        }
        catch (error) {
            res.status(400).send({ error: `Error al cerrar sesion: ${error}` });
        }
    } else {
        res.status(400).send({ error: `No hay sesion iniciada` });
    }
}

const sessionController = {
    validateUserData,
    register, 
    login,
    getCurrentSession,
    getGithubCreateUser,
    getGithubSessions,
    logout
}

export default sessionController