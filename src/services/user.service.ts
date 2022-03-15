import {UserRepository} from "../repository/user.repository";
import {getConnection} from "typeorm";
import {UserEntity} from "../database/entities/user.entity";
import {validate} from "class-validator";


export class UserService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = getConnection("default").getCustomRepository(UserRepository)
    }

    /**
     * Создает пользователя, имеет проверку на то, что пользователь уже создан
     */
    public create = async (user: UserEntity) => {
        //Валидация пользователей
        const validateErrors = await validate(user);
        let creteUserInDBError = ""
        const userWithSameEmail = await this.userRepository.findOne({where: {email: user.email}})

        const isUserWithSameEmailExist = !!userWithSameEmail?.id
        if (isUserWithSameEmailExist) {
            creteUserInDBError = "UserWithSameEmailAlreadyExist"
        }

        if (validateErrors.length || creteUserInDBError) {
            const resultErrorText = creteUserInDBError || validateErrors
            return {error: resultErrorText}
        } else {
            //Если ошибок нет - возвращаем объект нового пользователя без пароля
            const newUser: Partial<UserEntity> = await this.userRepository.save(user)
            if (newUser)
                delete newUser.password
            return newUser
        }
    }

    public getUserByEmail = async (email: string) => {
        return await this.userRepository.findOneOrFail({where: {email: email}})
    }

    public getUserByID = async (id: string) => {
        return await this.userRepository.findOneOrFail(id)
    }

}