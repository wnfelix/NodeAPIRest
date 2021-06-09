interface IMailConfig {
	driver: 'etheral' | 'ses';
	default: {
		from: {
			email: string;
			name: string;
		};
	};
}

export default {
	driver: process.env.MAIL_DRIVER || 'etheral',
	default: {
		from: {
			email: 'contato@williamdev.com',
			name: 'william felix',
		},
	},
} as IMailConfig;
