import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User, UserState } from '../../types/User';
import serviceApi from '../../../configs/services/api';
import { ResponseLogin } from '../../types/ResponseRequest';
import { AxiosError } from 'axios';

const initialState: UserState = {
	id: '',
	name: '',
	cpf: '',
	role: 'user',
	active: true,
	accessExpiration: new Date(),
	token: '',
	isLogged: false,
	loading: false,
	usersList: [],
	error: '',
};

export const createUser = createAsyncThunk(
	'user/create',
	async (
		user: { name: string; cpf: string; password: string },
		{ dispatch },
	) => {
		try {
			const token = localStorage.getItem('userLogged');

			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			};

			const response = await serviceApi.post('/user', user, { headers });

			const responseApi = response.data;

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data;

				return response;
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const loginUser = createAsyncThunk(
	'user/login',
	async (login: User, { dispatch }) => {
		try {
			const response = await serviceApi.post('/login', login);

			// Estrutura da resposta
			const responseApi = response.data;

			// Verifique se 'responseApi' tem a estrutura esperada e retorne ela
			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data; // Verifique que 'data' contém os dados esperados

				// Se houver resposta do erro, retorne ela, se não, um erro genérico
				return (
					response || {
						success: false,
						message: 'Erro inesperado.',
					}
				);
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const listUsers = createAsyncThunk<
	any,
	void,
	{ rejectValue: { message: string } }
>('user/list', async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem('userLogged');

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};

		const response = await serviceApi.get('/user', { headers });
		return response.data.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const response = error.response?.data;
			return rejectWithValue({
				message: response?.message || 'Erro ao listar usuários',
			});
		}
		return rejectWithValue({
			message: 'Erro inesperado ao listar usuários',
		});
	}
});

export const deleteUser = createAsyncThunk<
	{ success: boolean; message: string },
	string,
	{ rejectValue: { message: string } }
>('user/delete', async (cpf, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem('userLogged');

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};

		const response = await serviceApi.delete(`/user/${cpf}`, { headers });
		return response.data.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const response = error.response?.data;
			return rejectWithValue({
				message: response?.message || 'Erro ao excluir usuário.',
			});
		}
		return rejectWithValue({
			message: 'Erro inesperado ao excluir usuário.',
		});
	}
});

export const fetchUser = createAsyncThunk<
	{ success: string; message: string; data: UserState },
	string,
	{ rejectValue: { message: string } }
>('user/fetchUser', async (cpf, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem('userLogged');

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};

		const response = await serviceApi.get(`/user/${cpf}`, { headers });

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const response = error.response?.data;

			return rejectWithValue({
				message: response?.message || 'Erro ao buscar usuário.',
			});
		}

		return rejectWithValue({
			message: 'Erro inesperado ao buscar usuário.',
		});
	}
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			return {
				...state,
				id: action.payload.id,
				name: action.payload.name,
				cpf: action.payload.cpf,
				role: action.payload.role,
				active: action.payload.active,
				accessExpiration: action.payload.accessExpiration,
				token: action.payload.token,
				isLogged: true,
				loading: false,
			};
		},

		logoutUser: () => {
			return initialState;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(createUser.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(createUser.fulfilled, (state, action) => {
			const payload = action.payload;

			if (payload.success) {
				return {
					...state,
					loading: false,
				};
			}

			return {
				...state,
				loading: false,
				error: payload.message || 'Erro ao criar o usuário.',
			};
		});

		builder.addCase(createUser.rejected, () => {
			return initialState;
		});

		builder.addCase(loginUser.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(loginUser.fulfilled, (state, action) => {
			const payload = action.payload;

			if (payload.success && payload.data) {
				const currentDate = new Date();
				const accessExpiration = new Date(
					payload.data.accessExpiration,
				);
				const isActive = currentDate < accessExpiration;

				// Salve o token e outros dados no localStorage
				localStorage.setItem('userLogged', payload.data.token);

				return {
					...state,
					id: payload.data.id,
					name: payload.data.name,
					cpf: payload.data.cpf,
					role: payload.data.role,
					active: isActive,
					accessExpiration: payload.data.accessExpiration,
					token: payload.data.token,
					isLogged: true,
					loading: false,
				};
			}

			// Caso a resposta não tenha sucesso, limpe o estado
			if (!payload.success) {
				return initialState;
			}
		});

		builder.addCase(loginUser.rejected, () => {
			return initialState;
		});

		builder.addCase(listUsers.pending, (state) => {
			return { ...state, loading: true };
		});

		builder.addCase(listUsers.fulfilled, (state, action) => {
			state.usersList = action.payload.map((user: UserState) => {
				const currentDate = new Date();

				const accessExpiration = new Date(user.accessExpiration);

				const isActive = currentDate < accessExpiration;

				return {
					...user,
					active: isActive,
				};
			});
		});

		builder.addCase(listUsers.rejected, (state, action) => {
			return {
				...state,
				loading: false,
				error:
					action.payload?.message ||
					'Erro inesperado ao listar os usuários.',
			};
		});

		builder.addCase(deleteUser.pending, (state) => {
			return { ...state, loading: true };
		});

		builder.addCase(deleteUser.fulfilled, (state, action) => {
			if (action.payload.success) {
				state.usersList = state.usersList.filter(
					(user) => user.cpf !== action.meta.arg,
				);
				state.loading = false;
				state.error = '';
			} else {
				state.loading = false;
				state.error = action.payload.message;
			}
		});

		builder.addCase(deleteUser.rejected, (state, action) => {
			return {
				...state,
				loading: false,
				error:
					action.payload?.message ||
					'Erro inesperado ao excluir o usuário.',
			};
		});

		builder.addCase(fetchUser.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(fetchUser.fulfilled, (state, action) => {
			const payload = action.payload;

			if (payload.success) {
				return {
					...state,
					id: payload.data.id,
					name: payload.data.name,
					cpf: payload.data.cpf,
					role: payload.data.role,
					active: payload.data.active,
					accessExpiration: payload.data.accessExpiration,
					token: payload.data.token,
					isLogged: true,
					loading: false,
					error: '',
				};
			}

			return {
				...state,
				loading: false,
				error: payload.message || 'Erro ao buscar o usuário.',
			};
		});

		builder.addCase(fetchUser.rejected, (state, action) => {
			return {
				...state,
				loading: false,
				error:
					action.payload?.message ||
					'Erro inesperado ao buscar o usuário.',
			};
		});
	},
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
