import local from "passport-local";
import passport from "passport";
import jwt from 'passport-jwt'
import GithubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import userModel from "../models/usersModel.js";
import "dotenv/config";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

import logger from "../utils/loggers.js";



const initializePassport = () => {

  const cookieExtractor = (req) => {
    console.log(req.cookies)
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
  }, async(jwt_payload, done) => {
    try{
      return done(null, jwt_payload)
    } catch(error) {
      logger.error(error)
      return done(error)
    }
  }))

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: email });
          if (user) {
            return done(null, false);
          }
          const passwordHash = createHash(password);
          const userCreated = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            password: passwordHash,
          });
          return done(null, userCreated);
        } catch (error) {
          logger.error(error)
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (validatePassword(password, user.password)) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          logger.error(error)
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const hashPassword = createHash("password");
            const userCreated = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18, //Edad por defecto,
              password: hashPassword,
            });
            done(null, userCreated);
          } else {
            done(null, user);
          }
        } catch (error) {
          logger.error(error)
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};


export default initializePassport;
