import {Request, Response, Router} from "express";
import {UserService} from "../services/user.service";
import {UserEntity, UserWithOptionalPassword} from "../database/entities/user.entity";
import {saltForUserPassword} from "../auth-const";

const passport = require('passport')
const bcrypt = require('bcrypt');


export class UserController {
    public router: Router
    public userService: UserService

    constructor() {
        this.userService = new UserService
        this.router = Router()
        this.routes()
    }

    private register = async (req: Request, res: Response) => {
        const hashedPassword = await bcrypt.hash(req.body.password, saltForUserPassword)
        const user = new UserEntity()
        user.email = req.body.email
        user.password = hashedPassword

        const createdUser = await this.userService.create(user);
        res.status(200).json(createdUser);
    }


    private me = async (req, res: Response) => {
        const me: UserWithOptionalPassword | null = await req.user
        if (me?.password) {
            delete me.password
        }
        res.status(200).json(me)
    }
    private logout = async (req, res: Response) => {
        req.session.destroy()
        res.status(200).json({code: "ok"})
    }


    public routes() {
        this.router.post('/register', this.register)
        this.router.get("/me", this.me)
        this.router.post("/logout", this.logout)
        this.router.post('/login', passport.authenticate('local', {
            failureFlash: true,
            failureMessage: true
        }), function (req: any, res) {
            delete req.user.password
            res.json(req.user);
        })

    }

}