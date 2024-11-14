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
	const [selectedFile, setSelectedFile] = useState<File | null>(null); // Arquivo selecionado para upload

	useEffect(() => {
		dispatch(listFiles());
	}, [dispatch]);

	// Função para lidar com a seleção de arquivos
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0]; // Assume que o usuário seleciona um único arquivo .rar

			// Verifica se o arquivo tem a extensão .rar
			if (file.name.endsWith('.rar')) {
				setSelectedFile(file);
			} else {
				alert('Selecione um arquivo .rar');
			}
		}
	};

	// Função para fazer o upload
	const handleUpload = async () => {
		if (!selectedFile) {
			alert('Selecione um arquivo .rar para upload.');
			return;
		}

		setUploading(true);

		const formData = new FormData();
		formData.append('files', selectedFile); // Envia o arquivo .rar

		try {
			const token = localStorage.getItem('userLogged');
			if (!token) {
				console.error('Token de autenticação não encontrado');
				setUploading(false);
				return;
			}

			// Envia o arquivo .rar para o backend
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
			alert('Arquivo carregado com sucesso!');
			setSelectedFile(null); // Limpa o arquivo selecionado
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

			// URL do backend definida na variável de ambiente
			const fileUrl = `${import.meta.env.VITE_API_URL}/file/download-jonbet`;

			const token = localStorage.getItem('userLogged');

			if (!token) {
				console.error('Token de autenticação não encontrado');
				setLoading(false);
				return;
			}

			// Requisição para o backend
			const response = await fetch(fileUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const blob = await response.blob();
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'JonBet.rar';
				document.body.appendChild(link);
				link.click();
				URL.revokeObjectURL(link.href);
				document.body.removeChild(link);
			} else {
				console.error('Erro ao baixar o arquivo:', response.status);
			}
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
					onChange={handleFileChange}
					style={{ display: 'none' }} // Ocultar o campo de input
					id="file-upload"
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
							'Selecionar Arquivo .rar'
						)}
					</Button>
				</label>

				<Button
					onClick={handleUpload}
					disabled={uploading || !selectedFile}
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
