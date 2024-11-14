import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FileState {
	file: {
		id: string | null;
		filename: string | null;
		filepath: string | null;
		size: number | null;
	};
	files: Array<{
		id: string;
		filename: string;
		filepath: string;
		size: number;
	}> | null;
	loading: boolean;
	error: string | null;
}

const initialState: FileState = {
	file: {
		id: null,
		filename: null,
		filepath: null,
		size: null,
	},
	files: [],
	loading: false,
	error: null,
};

export const uploadFile = createAsyncThunk(
	'file/uploadFile',
	async (file: File, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem('userLogged');
			if (!token) {
				return rejectWithValue('Token inválido ou expirado');
			}

			const formData = new FormData();
			formData.append('file', file);

			const response = await axios.post(
				'http://localhost:8080/file',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				},
			);

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data?.message || 'Error uploading file',
				);
			}
			return rejectWithValue('Unexpected error occurred');
		}
	},
);

export const listFiles = createAsyncThunk(
	'file/listFiles',
	async (_, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem('userLogged');
			if (!token) {
				return rejectWithValue('Token inválido ou expirado');
			}

			const response = await axios.get('http://localhost:8080/file', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data?.message || 'Error fetching files',
				);
			}
			return rejectWithValue('Unexpected error occurred');
		}
	},
);

const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(uploadFile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(uploadFile.fulfilled, (state, action) => {
				state.loading = false;
				state.file = action.payload;
			})
			.addCase(uploadFile.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Erro desconhecido';
			});

		builder
			.addCase(listFiles.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(listFiles.fulfilled, (state, action) => {
				state.loading = false;
				state.files = Array.isArray(action.payload.data)
					? action.payload.data
					: [];
			})

			.addCase(listFiles.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Erro desconhecido';
			});
	},
});

export default fileSlice.reducer;
