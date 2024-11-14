import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Grid,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { listFiles } from '../../../../store/modules/File/fileSlice';

export const Bots = () => {
	const { files } = useAppSelector((state) => state.file);
	const userState = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(listFiles());
	}, [dispatch]);

	const handleDownload = async () => {
		try {
			const fileUrl = 'http://localhost:8080/file/download-jonbet';

			const token = localStorage.getItem('userLogged');

			console.log('Token de autenticação:', token);

			const response = await fetch(fileUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('Status da resposta:', response.status);

			if (!response.ok) {
				throw new Error('Erro ao baixar o arquivo');
			}

			const blob = await response.blob();
			console.log('Blob criado:', blob);

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'JonBet.rar';
			link.click();

			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Erro ao realizar o download:', error);
		}
	};

	return (
		<Box sx={{ padding: 2 }}>
			<Grid container spacing={2}>
				{Array.isArray(files) ? (
					files.map((file) => (
						<Grid item xs={12} sm={6} md={4} key={file.id}>
							<Card sx={{ minHeight: 150 }}>
								<CardContent>
									<Typography variant="h6">
										{file.filename}
									</Typography>
									<Typography variant="body2">
										Size: {file.size} bytes
									</Typography>
								</CardContent>
								<CardActions>
									<Button
										disabled={!userState.active}
										size="small"
										variant="contained"
										onClick={handleDownload}
									>
										Download
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))
				) : (
					<Typography variant="body1">No files available.</Typography>
				)}
			</Grid>
		</Box>
	);
};
