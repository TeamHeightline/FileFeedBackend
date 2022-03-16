import express from 'express';
import {createConnection} from "typeorm";
import {UserController} from "./api/user.controller";
import {sessionSecret} from "./auth-const";
import {initializePassport} from "./passport-config";
import {FileController} from './api/file.controller';

const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport');
const multer = require('multer')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

export class Server {
    private userController: UserController;
    private fileController: FileController;
    private app: express.Application;

    constructor() {
        this.app = express(); // init the application
    }

    /**
     * Конфигурация сервера (подключение всех мидлвееров)
     */
    public async configuration() {
        await this.activateControllers()

        this.app.set('port', process.env.PORT || 3001);
        this.app.use(express.json());
        this.app.use(cors({
            credentials: true,
            origin: "http://localhost:3000"
        }))
        /**
         * Подключение авторизации
         */


        initializePassport(
            passport,
            this.userController.userService.getUserByEmail,
            this.userController.userService.getUserByID
        )

        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(flash())
        this.app.use(session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false
        }))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(methodOverride('_method'))

        /**
         * Подключение системы работы с файлами в запросе
         */
        const multerMid = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        })
        this.app.use(multerMid.single('file'))

        /**
         * Подключение всех роутов
         */
        this.routes()
    }

    /**
     * Подключение базы данных, запуск контроллеров
     */
    public async activateControllers() {
        await createConnection();
        this.userController = new UserController();
        this.fileController = new FileController();
    }

    /**
     * Настройка роутинга
     */
    public routes() {

        //Добавление роутера пользователей прямо в коренной роут
        this.app.use('', this.userController.router);

        //Роуты для отдельных entity
        this.app.use('/file/', this.fileController.router)
    }

    /**
     * Точка запуска всего сервера
     */
    public start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening ${this.app.get('port')} port.`);
        });

    }
}

const server = new Server();
server.configuration().then(() => server.start())

