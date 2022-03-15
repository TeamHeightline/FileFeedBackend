import {getConnection} from 'typeorm';
import {PostEntity} from '../database/entities/post.entity';
import {PostRepository} from '../repository/post.repository';

export class PostService {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = getConnection("default").getCustomRepository(PostRepository);
    }

    public index = async () => {
        return await this.postRepository.find();
    }

    public create = async (post: PostEntity) => {
        return await this.postRepository.save(post);
    }

    public update = async (post: PostEntity, id: number) => {
        return await this.postRepository.update(id, post);
    }

    public delete = async (id: number) => {
        return await this.postRepository.delete(id);
    }
}