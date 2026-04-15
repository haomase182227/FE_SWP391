import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'kinetic_auth_user';
const API_BASE = '/api/v1';

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
	const [walletBalance, setWalletBalance] = useState(null);
	const [walletLoading, setWalletLoading] = useState(false);

	// Fetch wallet từ /me mỗi khi có user với token (kể cả refresh trang)
	useEffect(() => {
		if (!currentUser?.token) {
			setWalletBalance(null);
			return;
		}
		fetchWalletBalance(currentUser.token);
	}, [currentUser?.token]);

	async function fetchWalletBalance(token) {
		setWalletLoading(true);
		try {
			const res = await fetch(`${API_BASE}/Auth/users/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			// API trả về { user: { wallet, ... } } hoặc { wallet, ... }
			const balance = data?.user?.wallet ?? data?.wallet ?? null;
			setWalletBalance(balance);
		} catch {
			setWalletBalance(null);
		} finally {
			setWalletLoading(false);
		}
	}

	function _saveUser(data, fallbackEmail) {
		const u = data.user;
		const safeUser = {
			id: u.id,
			email: u.email ?? fallbackEmail,
			role: u.role ?? 'Buyer',
			name: u.userName,
			token: data.token,
		};
		setCurrentUser(safeUser);
		localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
		return safeUser;
	}

	async function login({ email, password }) {
		try {
			const res = await fetch(`${API_BASE}/Auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				return { success: false, message: data?.message || 'Sai email hoặc mật khẩu.' };
			}

			const safeUser = _saveUser(data, email);
			return { success: true, user: safeUser, redirectPath: getRedirectPathByRole(safeUser.role) };
		} catch {
			return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' };
		}
	}

	async function register({ userName, fullName, email, phone, password, role }) {
		try {
			const res = await fetch(`${API_BASE}/Auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userName, fullName, email, phone, password, role }),
			});

			const data = await res.json();

			if (!res.ok) {
				return { success: false, message: data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' };
			}

			const safeUser = _saveUser(data, email);
			return { success: true, user: safeUser, redirectPath: getRedirectPathByRole(safeUser.role) };
		} catch {
			return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' };
		}
	}

	function logout() {
		setCurrentUser(null);
		setWalletBalance(null);
		localStorage.removeItem(AUTH_STORAGE_KEY);
	}

	const value = useMemo(
		() => ({
			currentUser,
			isAuthenticated: Boolean(currentUser),
			walletBalance,
			walletLoading,
			refreshWallet: () => currentUser?.token && fetchWalletBalance(currentUser.token),
			login,
			logout,
			register,
			getRedirectPathByRole,
		}),
		[currentUser, walletBalance, walletLoading]
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