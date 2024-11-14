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
	const [loading, setLoading] = useState(false); // Estado de carregamento do download
	const [uploading, setUploading] = useState(false); // Estado de carregamento do upload
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Arquivos selecionados para upload

	useEffect(() => {
		dispatch(listFiles());
	}, [dispatch]);

	// Função para lidar com a seleção de arquivos
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedFiles(Array.from(event.target.files));
		}
	};

	// Função para fazer o upload
	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			alert('Selecione pelo menos um arquivo para upload.');
			return;
		}

		setUploading(true);

		const formData = new FormData();

		// Adiciona os arquivos ao FormData
		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

		try {
			const token = localStorage.getItem('userLogged');
			if (!token) {
				console.error('Token de autenticação não encontrado');
				setUploading(false);
				return;
			}

			// Envia os arquivos para o backend
			const response = await fetch(
				'https://panel-api-k76f.onrender.com/upload',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				},
			);

			if (!response.ok) {
				throw new Error('Erro ao fazer upload dos arquivos');
			}

			// Sucesso no upload
			alert('Arquivos carregados com sucesso!');
			setSelectedFiles([]); // Limpa os arquivos selecionados
		} catch (error) {
			console.error('Erro ao realizar o upload:', error);
			alert('Erro ao realizar o upload');
		} finally {
			setUploading(false); // Finaliza o carregamento
		}
	};

	// Função para fazer o download
	const handleDownload = async () => {
		try {
			setLoading(true);
			const fileUrl =
				'https://panel-api-k76f.onrender.com/file/download-jonbet';

			const token = localStorage.getItem('userLogged');

			if (!token) {
				console.error('Token de autenticação não encontrado');
				setLoading(false);
				return;
			}

			const response = await fetch(fileUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Erro ao baixar o arquivo');
			}

			const blob = await response.blob();
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'JonBet.rar';
			link.click();

			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Erro ao realizar o download:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ padding: 2 }}>
			{/* Formulário de Upload */}
			<Box sx={{ marginBottom: 2 }}>
				{/* Usando um <input> para o upload de arquivos */}
				<input
					type="file"
					multiple
					onChange={handleFileChange}
					style={{ display: 'none' }} // Ocultar o campo de input
					id="file-upload"
					// Adiciona o atributo webkitdirectory usando `as any` para evitar o erro de tipo
					{...({ webkitdirectory: true } as any)}
				/>

				<label htmlFor="file-upload">
					<Button
						component="span"
						variant="contained"
						disabled={uploading}
					>
						{uploading ? (
							<CircularProgress size={24} />
						) : (
							'Selecionar Arquivos'
						)}
					</Button>
				</label>

				<Button
					onClick={handleUpload}
					disabled={uploading || selectedFiles.length === 0}
					variant="contained"
					sx={{ marginTop: 2 }}
				>
					{uploading ? (
						<CircularProgress size={24} />
					) : (
						'Fazer Upload'
					)}
				</Button>
			</Box>

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
										disabled={!userState.active || loading}
										size="small"
										variant="contained"
										onClick={handleDownload}
									>
										{loading ? 'Baixando...' : 'Download'}
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
