import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './User/userSlice';
import fileSlice from './File/fileSlice';
import loadingSlice from './Loading/loadingSlice';
import modalContextSlice from './ModalContext/modalContextSlice';

const rootReducer = combineReducers({
	// a cada novo slice, adicionamos uma nova propriedade neste objeto
	// propriedade - nome na store
	// valor - reducer/manager deste estado global
	// modal: modalSlice,
	// modal: modalTarefasSlice,
	user: userSlice,
	file: fileSlice,
	loading: loadingSlice,
	context: modalContextSlice,
});

export default rootReducer;
