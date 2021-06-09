import { getCustomRepository } from 'typeorm';
import UserToken from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

class ListUserService {
	public async execute(): Promise<UserToken[]> {
		const usersRepository = getCustomRepository(UsersRepository);

		const users = await usersRepository.find();

		return users;
	}
}

export default ListUserService;
