import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface AuthState {
	token: string | null
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
}

const savedToken = localStorage.getItem("token")

const initialState: AuthState = {
	token: savedToken,
	status: 'idle',
	error: null,
}

export const login = createAsyncThunk(
	'auth/login',
	async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => ({}))
				return rejectWithValue(data?.error || 'login_failed')
			}
			const data = (await res.json()) as { token: string }
			return data.token
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			return rejectWithValue('network_error')
		}
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.token = null
			state.status = 'idle'
			state.error = null
			localStorage.removeItem("token")
		},
		setToken(state, action: PayloadAction<string | null>) {
			state.token = action.payload
			if (action.payload) {
				localStorage.setItem("token", action.payload)
			} else {
				localStorage.removeItem("token")
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.token = action.payload
				localStorage.setItem("token", action.payload)
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed'
				state.error = (action.payload as string) || 'login_failed'
			})
	},
})

export const { logout, setToken } = authSlice.actions
export default authSlice.reducer 