import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsEmail, IsNotEmpty} from "class-validator";
import {FileEntity} from "./file.entity";

@Entity('user')
@Unique(['email'])
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'email'})
    @IsEmail({}, {message: 'Incorrect email'})
    @IsNotEmpty({message: 'The email is required'})
    email!: string;

    @Column()
    @IsNotEmpty({message: 'The password is required'})
    password: string;

    @OneToMany(() => FileEntity, file => file.user)
    files: FileEntity[];
}