export interface User {
	cpf: string;
	password: string;
}

interface UserForList {
	id: string;
	name: string;
	cpf: string;
	role: string;
	active: boolean;
	accessExpiration: string;
}

export interface UserState {
	id: string;
	name: string;
	cpf: string;
	role: 'admin' | 'user';
	active: boolean;
	accessExpiration: Date;
	token: string;
	isLogged: boolean;
	loading: boolean;
	usersList: UserForList[];
	error: string;
}
