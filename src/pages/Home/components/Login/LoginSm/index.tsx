import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material';
import Logo from '../../../../../assets/images/logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import {
	hideLoading,
	showLoading,
} from '../../../../../store/modules/Loading/loadingSlice';
import { loginUser } from '../../../../../store/modules/User/userSlice';
import { useSnackbar } from 'notistack';

export const LoginSm = () => {
	const [cpf, setCpf] = useState('');
	const [password, setPassword] = useState('');
	const [showForm, setShowForm] = useState(false);

	const dispatch = useAppDispatch();

	const loadingState = useAppSelector((state) => state.loading);

	const navigate = useNavigate();

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowForm(true);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (!cpf || !password) {
			enqueueSnackbar('CPF/CNPJ e Senha são obrigatórios.', {
				variant: 'error',
			});
			return;
		}

		const userData = {
			cpf,
			password,
		};

		dispatch(showLoading());

		const result = await dispatch(loginUser(userData));

		if (loginUser.fulfilled.match(result) && result.payload.success) {
			enqueueSnackbar('Login realizado com sucesso!', {
				variant: 'success',
			});
			navigate('/interface');
		} else {
			enqueueSnackbar('CPF/CNPJ ou Senha errados.', { variant: 'error' });
		}

		dispatch(hideLoading());
	};
	return (
		<Box
			sx={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				background: '#000',
			}}
		>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 4,
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							width: '30%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative',
							zIndex: 1,
						}}
					></Box>
				</Box>
			</Box>
		</Box>
	);
};
