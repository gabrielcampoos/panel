import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { showModal } from '../../../../store/modules/ModalContext/modalContextSlice';
import { ClientsModal } from './components/ClientsModal';
import {
	deleteUser,
	listUsers,
} from '../../../../store/modules/User/userSlice';

export const Clients = () => {
	const dispatch = useAppDispatch();

	const users = useAppSelector((state) => state.user.usersList);

	const filteredClients = Array.isArray(users)
		? users.filter((user) => user.role === 'user')
		: [];

	useEffect(() => {
		dispatch(listUsers());
	}, [dispatch]);

	const formatExpirationDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
	};

	const handleDelete = (cpf: string) => {
		dispatch(deleteUser(cpf));
	};

	return (
		<>
			<Box sx={{ padding: 2 }}>
				<Typography variant="h4" gutterBottom>
					Lista de Clientes
				</Typography>

				<Button
					variant="contained"
					color="primary"
					sx={{ marginBottom: 2 }}
					onClick={() => dispatch(showModal('create'))}
				>
					Criar Cliente
				</Button>

				<TableContainer component={Paper} sx={{ marginTop: 2 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Nome</TableCell>
								<TableCell>CPF</TableCell>
								<TableCell>Ativo</TableCell>
								<TableCell>Expira em</TableCell>
								<TableCell>Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredClients.map((client) => (
								<TableRow key={client.id}>
									<TableCell>{client.name}</TableCell>
									<TableCell>{client.cpf}</TableCell>
									<TableCell>
										{client.active ? 'Sim' : 'Não'}
									</TableCell>
									<TableCell>
										{formatExpirationDate(
											client.accessExpiration,
										)}
									</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="error"
											onClick={() =>
												handleDelete(client.cpf)
											}
										>
											Deletar
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<ClientsModal />
		</>
	);
};
