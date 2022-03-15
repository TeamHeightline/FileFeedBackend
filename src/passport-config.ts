import {UserEntity} from "./database/entities/user.entity";
import {saltForUserPassword} from "./auth-const";

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

export function initializePassport(
    passport,
    getUserByEmail: (email: string) => Promise<UserEntity | null>,
    getUserById: (email: string) => Promise<UserEntity | null>
) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'No user with that email'})
        }
        try {
            const hashedPassword = await bcrypt.hash(password, saltForUserPassword)
            const isPasswordsSame = user.password == hashedPassword
            if (isPasswordsSame) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use('local-login', new LocalStrategy({
        // Fields to accept
        usernameField: 'email', // default is username, override to accept email
        passwordField: 'password',
        passReqToCallback: true // allows us to access req in the call back
    }, async (req, email, password, done) => {
        // Check if user and password is valid
        let user = await getUserByEmail(email)
        const hashedPassword = await bcrypt.hash(password, saltForUserPassword)
        const isPasswordsSame = user?.password == hashedPassword

        // If password valid call done and serialize user.id to req.user property
        if (isPasswordsSame) {
            return done(null, {
                id: user?.id
            })
        }
        // If invalid call done with false and flash message
        return done(null, false, {
            message: 'Invalid email and/or password'
        });
    }))


    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}