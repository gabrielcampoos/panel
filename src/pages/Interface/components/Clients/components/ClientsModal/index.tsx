import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
	createUser,
	listUsers,
} from '../../../../../../store/modules/User/userSlice';
import { hideModal } from '../../../../../../store/modules/ModalContext/modalContextSlice';

export const ClientsModal = () => {
	const [name, setName] = useState('');
	const [cpf, setCpf] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useAppDispatch();

	const { context, isOpen } = useAppSelector((state) => state.context);

	const closeModal = () => {
		dispatch(hideModal());
	};

	const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		try {
			switch (context) {
				case 'create':
					await dispatch(
						createUser({
							name,
							cpf,
							password,
						}),
					).unwrap();

					enqueueSnackbar('Usuário criado com sucesso!', {
						variant: 'success',
					});
					break;

				case 'delete':
					break;
			}
		} catch (error) {
			enqueueSnackbar('Ocorreu um erro ao salvar a conta filha.', {
				variant: 'error',
			});
		} finally {
			dispatch(listUsers());
			dispatch(hideModal());
		}
	};

	return (
		<Dialog open={isOpen}>
			<Box component={'form'} onSubmit={handleSubmit}>
				{(context !== 'delete' && (
					<>
						<DialogTitle>
							{context === 'create' && 'Criar usuário'}
						</DialogTitle>

						<>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									name="name"
									id="name"
									label="Nome"
									type="text"
									fullWidth
									variant="filled"
									onChange={(ev) => setName(ev.target.value)}
									value={name}
								/>
								<TextField
									autoFocus
									margin="dense"
									id="cpf"
									name="cpf"
									label="CPF"
									type="text"
									fullWidth
									variant="filled"
									onChange={(ev) => setCpf(ev.target.value)}
									value={cpf}
								/>
								<TextField
									autoFocus
									margin="dense"
									id="password"
									name="password"
									label="Senha"
									type="text"
									fullWidth
									variant="filled"
									onChange={(ev) =>
										setPassword(ev.target.value)
									}
									value={password}
								/>
							</DialogContent>
							<DialogActions>
								<Button
									type="button"
									variant="outlined"
									onClick={closeModal}
								>
									Cancelar
								</Button>
								<Button
									type="submit"
									color="success"
									variant="contained"
								>
									Salvar
								</Button>
							</DialogActions>
						</>
					</>
				)) ||
					''}
			</Box>
		</Dialog>
	);
};
