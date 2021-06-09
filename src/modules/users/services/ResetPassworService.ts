import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import { isAfter, addHours } from 'date-fns';

interface IRequest {
	token: string;
	password: string;
}

class ResetPasswordService {
	public async execute({ token, password }: IRequest): Promise<void> {
		const usersRepository = getCustomRepository(UsersRepository);
		const userTokenRepository = getCustomRepository(UserTokensRepository);

		const userToken = await userTokenRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('Usertoken does not exist');
		}

		const user = await usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User does not exist');
		}

		const tokenCreatedAt = userToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2);

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token expired');
		}

		user.password = await hash(password, 8);

		await usersRepository.save(user);

		console.log(token);
	}
}

export default ResetPasswordService;
