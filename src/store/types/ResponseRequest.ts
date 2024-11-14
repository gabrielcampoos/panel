export interface ResponseLogin {
	success: boolean;
	message: string;
	data?: {
		id: string;
		name: string;
		cpf: string;
		role: 'admin' | 'user';
		active: boolean;
		accessExpiration: Date;
		token: string;
	};
}
