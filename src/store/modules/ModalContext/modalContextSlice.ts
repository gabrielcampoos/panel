import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContextState } from '../../types/Context';

const initialState: ContextState = {
	isOpen: false,
	context: 'create',
};

export const sliceContext = createSlice({
	name: 'modalContext',
	initialState,
	reducers: {
		showModal: (state, action: PayloadAction<'create' | 'delete'>) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModal: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { hideModal, showModal } = sliceContext.actions;

export default sliceContext.reducer;
