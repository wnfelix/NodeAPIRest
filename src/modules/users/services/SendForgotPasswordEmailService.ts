import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
	email: string;
}

class SendForgotPasswordEmailService {
	public async execute({ email }: IRequest): Promise<void> {
		const usersRepository = getCustomRepository(UsersRepository);
		const userTokenRepository = getCustomRepository(UserTokensRepository);

		const user = await usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exist');
		}

		const { token } = await userTokenRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'..',
			'views',
			'forgot_password.hbs',
		);
		//console.log(token);
		await EtherealMail.sendMail({
			to: {
				name: user.name,
				email: user.email,
			},
			subject: '[API VENDAS] Recuperação de vendas',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name,
					link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
				},
			},
		});
	}
}

export default SendForgotPasswordEmailService;
