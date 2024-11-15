import {
	Box,
	Button,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import Logo from '../../../../assets/images/logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { LoginSm } from './LoginSm';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useState } from 'react';
import { loginUser } from '../../../../store/modules/User/userSlice';
import {
	hideLoading,
	showLoading,
} from '../../../../store/modules/Loading/loadingSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';

export const Login = () => {
	const [cpf, setCpf] = useState('');
	const [password, setPassword] = useState('');

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const dispatch = useAppDispatch();

	const loadingState = useAppSelector((state) => state.loading);

	const navigate = useNavigate();

	const { enqueueSnackbar } = useSnackbar();

	const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (!cpf || !password) {
			enqueueSnackbar('CPF e Senha são obrigatórios.', {
				variant: 'error',
			});
			return;
		}

		const userData = { cpf, password };
		dispatch(showLoading());

		try {
			const result = await dispatch(loginUser(userData));

			// Verifica se a resposta é bem-sucedida e contém os dados necessários
			if (loginUser.fulfilled.match(result) && result.payload.success) {
				enqueueSnackbar('Login realizado com sucesso!', {
					variant: 'success',
				});

				// Navegar para a página de interface
				navigate('/interface');
			} else {
				enqueueSnackbar('CPF ou Senha errados.', { variant: 'error' });
			}
		} catch (error) {
			enqueueSnackbar('Ocorreu um erro ao fazer login.', {
				variant: 'error',
			});
		} finally {
			dispatch(hideLoading());
		}
	};

	return (
		<>
			{(smDown && (
				<>
					<LoginSm />
				</>
			)) || (
				<Box
					sx={{
						width: '100dvw',
						height: '100dvh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						background: '#CEEFFF',
						flexDirection: 'column',
						gap: 3,
					}}
				>
					<Box
						component="img"
						src={Logo}
						alt="Logo"
						sx={{ width: 150, height: 150, mb: 2 }}
					/>

					<Box
						component="form"
						onSubmit={handleLogin}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%',
							maxWidth: 400,
							p: 3,
							borderRadius: 1,
							boxShadow: 3,
							background: '#fff',
							gap: 2,
						}}
					>
						<Typography
							variant="h5"
							color="textPrimary"
							gutterBottom
						>
							Login
						</Typography>

						<TextField
							label="CPF"
							variant="outlined"
							fullWidth
							value={cpf}
							onChange={(e) => setCpf(e.target.value)}
							required
						/>

						<TextField
							label="Senha"
							variant="outlined"
							type="password"
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{
								backgroundColor: '#040074',
								':hover': {
									backgroundColor: '#030061',
								},
							}}
						>
							{loadingState.open ? (
								<CircularProgress size={24} />
							) : (
								'Entrar'
							)}
						</Button>
					</Box>
				</Box>
			)}
		</>
	);
};
