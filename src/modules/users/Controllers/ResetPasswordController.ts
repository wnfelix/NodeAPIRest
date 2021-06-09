import { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPassworService';

export default class ResetPasswordController {
	public async create(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { password, token } = request.body;

		const resetForgotPasswordEmail = new ResetPasswordService();

		await resetForgotPasswordEmail.execute({
			password,
			token,
		});

		return response.status(204).json();
	}
}
