import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from '../../pages/Home';
import { Interface } from '../../pages/Interface';

const AppRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/interface" element={<Interface />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
