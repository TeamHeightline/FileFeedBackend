import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity({name: "file"})
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    mimetype: string;

    @Column()
    @Index()
    destination: string;

    @Column()
    @Index()
    filename: string;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    @Index()
    created_at: Date;

    @ManyToOne(() => UserEntity, user => user.files)
    @Index()
    user: UserEntity;
}