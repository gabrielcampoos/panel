import {
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import Logo from '../../assets/images/logo.jpeg';
import UpdateIcon from '@mui/icons-material/Update';
import ToggleButton from '@mui/material/ToggleButton';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	fetchUser,
	loginUser,
	logoutUser,
	setUser,
} from '../../store/modules/User/userSlice';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { Clients } from './components/Clients';
import { Bots } from './components/Bots';

export const Interface = () => {
	const [selectedButton, setSelectedButton] = useState('bots');

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const userState = useAppSelector((state) => state.user);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const token = localStorage.getItem('userLogged');
		const cpf = userState.cpf;
		if (token && cpf && userState.isLogged) {
			dispatch(fetchUser(cpf))
				.unwrap()
				.then((response) => {
					console.log('User fetched successfully:', response);
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
		}
	}, [dispatch, userState.isLogged, userState.cpf]);

	return (
		<Box
			sx={{
				width: '100dvw',
				height: '100dvh',
				display: 'flex',
				justifyContent: 'flex-start',
				alignItems: 'stretch',
			}}
		>
			<Box
				sx={{
					width: '10dvw',
					height: '100dvh',
					background: '#CEEFFF',
				}}
			>
				<Grid container spacing={2}>
					<Grid
						item
						xs={12}
						sm={12}
						md={12}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Box
							component="img"
							src={Logo}
							sx={{
								width: '30%',
							}}
						/>
					</Grid>

					<Grid item xs={12} sm={12} md={12}>
						<Button
							sx={{
								width: '100%',
								fontSize: '1rem',
								color: '#040074',
							}}
						>
							{userState.name}
						</Button>
					</Grid>

					<Divider
						sx={{
							width: '100%',
						}}
					/>

					{userState.role === 'admin' ? (
						<Grid item xs={12} sm={12} md={12}>
							<Button
								sx={{
									width: '100%',
									fontSize: '0.8rem',
									color: '#040074',
								}}
								onClick={() => setSelectedButton('clients')}
							>
								Clientes
							</Button>
						</Grid>
					) : (
						''
					)}

					<Grid item xs={12} sm={12} md={12}>
						<Button
							sx={{
								width: '100%',
								fontSize: '0.8rem',
								color: '#040074',
							}}
							onClick={() => setSelectedButton('bots')}
						>
							Bots
						</Button>
					</Grid>
				</Grid>
			</Box>

			<Box
				sx={{
					width: '90dvw',
					height: '100dvh',
				}}
			>
				{selectedButton === 'clients' ? <Clients /> : <Bots />}
			</Box>
		</Box>
	);
};
