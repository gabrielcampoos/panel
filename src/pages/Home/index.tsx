import { Box } from '@mui/material';
import { Login } from './components/Login';

export const Home = () => {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Login />
		</Box>
	);
};
