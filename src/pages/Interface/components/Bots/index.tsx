import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Grid,
	Typography,
	CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { listFiles } from '../../../../store/modules/File/fileSlice';

export const Bots = () => {
	const { files } = useAppSelector((state) => state.file);
	const userState = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	const [downloadLoading, setDownloadLoading] = useState<string | null>(null); // Agora aceita string ou null

	useEffect(() => {
		dispatch(listFiles());
	}, [dispatch]);

	// Função para fazer o download
	const handleDownload = async (fileId: string) => {
		try {
			setDownloadLoading(fileId); // Define o estado de carregamento para o arquivo em questão

			// URL de download direta do Google Drive
			const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

			// Criar o link de download
			const link = document.createElement('a');
			link.href = fileUrl;
			link.download = 'arquivo.rar'; // Defina o nome do arquivo para o download

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			alert('Seu download vai começar em instantes, por favor aguarde.');
		} catch (error) {
			console.error('Erro ao realizar o download:', error);
		} finally {
			setDownloadLoading(null); // Reseta o estado de carregamento quando o download terminar
		}
	};

	return (
		<Box sx={{ padding: 2 }}>
			{/* Lista de arquivos */}
			<Grid container spacing={2}>
				{Array.isArray(files) && files.length > 0 ? (
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
										disabled={
											userState.active === false ||
											downloadLoading !== null
										}
										size="small"
										variant="contained"
										onClick={() =>
											handleDownload(
												'12Ntlya_17AyxQmZ0gUTWkArdMrG3f6je',
											)
										} // Passa o ID do arquivo
									>
										{downloadLoading ===
										'12Ntlya_17AyxQmZ0gUTWkArdMrG3f6je'
											? 'Baixando...'
											: 'Download'}
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))
				) : (
					<Typography variant="body1">
						Nenhum arquivo disponível.
					</Typography>
				)}
			</Grid>
		</Box>
	);
};
