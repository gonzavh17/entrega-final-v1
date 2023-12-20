import { Router } from "express";
import passport from "passport";
import 'dotenv/config'
import { authorization,passportError } from "../services/errors/messageErrors.js";
import sessionController from "../controllers/sessionsController.js";

const sessionRouter = Router();

sessionRouter.post('/register', sessionController.validateUserData, passport.authenticate('register'), sessionController.register);

sessionRouter.post('/login', passport.authenticate('login'), sessionController.login)
sessionRouter.get('/current', passportError('jwt'), authorization(['user']), sessionController.getCurrentSession)
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.getGithubCreateUser )
sessionRouter.get('/githubSessions', passport.authenticate('github'), sessionController.getGithubSessions)
sessionRouter.get('/logout', sessionController.logout)

export default sessionRouter;