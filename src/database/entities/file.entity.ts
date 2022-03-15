import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity({name: "file"})
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mimetype: string;

    @Column()
    destination: string;

    @Column()
    filename: string;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    created_at: Date;

    @ManyToOne(() => UserEntity, user => user.files)
    user: UserEntity;
}