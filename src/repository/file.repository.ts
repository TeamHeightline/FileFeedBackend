import {EntityRepository, Repository} from "typeorm";
import {FileEntity} from "../database/entities/file.entity";

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {

}