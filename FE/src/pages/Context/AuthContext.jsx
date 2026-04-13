import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'kinetic_auth_user';

const MOCK_USERS = [
	{
		email: 'buyer@kinetic.vn',
		password: '123456',
		role: 'Buyer',
		name: 'Buyer Demo',
	},
	{
		email: 'admin@kinetic.vn',
		password: '123456',
		role: 'Admin',
		name: 'Admin Demo',
	},
	{
		email: 'inspector@kinetic.vn',
		password: '123456',
		role: 'Inspector',
		name: 'Inspector Demo',
	},
	{
		email: 'seller@kinetic.vn',
		password: '123456',
		role: 'Seller',
		name: 'Seller Demo',
	},
];

function getRedirectPathByRole(role) {
	switch (role) {
		case 'Admin':
			return '/admin/dashboard';
		case 'Inspector':
			return '/inspector';
		case 'Seller':
			return '/seller';
		case 'Buyer':
		default:
			return '/';
	}
}

function getInitialUser() {
	const raw = localStorage.getItem(AUTH_STORAGE_KEY);
	if (!raw) return null;

	try {
		return JSON.parse(raw);
	} catch {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(getInitialUser);

	function login({ email, password }) {
		const normalizedEmail = email.trim().toLowerCase();

		const matchedUser = MOCK_USERS.find(
			(user) =>
				user.email.toLowerCase() === normalizedEmail &&
				user.password === password
		);

		if (!matchedUser) {
			return {
				success: false,
				message: 'Sai email hoac mat khau.',
			};
		}

		const safeUser = {
			email: matchedUser.email,
			role: matchedUser.role,
			name: matchedUser.name,
		};

		setCurrentUser(safeUser);
		localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));

		return {
			success: true,
			user: safeUser,
			redirectPath: getRedirectPathByRole(safeUser.role),
		};
	}

	function logout() {
		setCurrentUser(null);
		localStorage.removeItem(AUTH_STORAGE_KEY);
	}

	const value = useMemo(
		() => ({
			currentUser,
			isAuthenticated: Boolean(currentUser),
			mockUsers: MOCK_USERS,
			login,
			logout,
			getRedirectPathByRole,
		}),
		[currentUser]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider.');
	}
	return context;
}
