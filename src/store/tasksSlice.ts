/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export type SortField = 'username' | 'email' | 'status'
export type SortOrder = 'asc' | 'desc'

export interface Task {
	id: number
	username: string
	email: string
	text: string
	completed: number 
	edited_by_admin: number
	created_at: string
}

interface PaginatedResult {
	items: Task[]
	total: number
	page: number
	pages: number
}

interface TasksState {
	items: Task[]
	total: number
	page: number
	pages: number
	sort: SortField
	order: SortOrder
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
}

interface RootState {
	tasks: TasksState
	auth?: { token?: string | null }
}

const initialState: TasksState = {
	items: [],
	total: 0,
	page: 1,
	pages: 1,
	sort: 'username',
	order: 'asc',
	status: 'idle',
	error: null,
}

export const fetchTasks = createAsyncThunk<PaginatedResult, void, { state: { tasks: TasksState } }>(
	'tasks/fetch',
	async (_arg, { getState, rejectWithValue }) => {
		const state = getState() as { tasks: TasksState }
		const { page, sort, order } = state.tasks
		try {
			const res = await fetch(`${API_BASE_URL}/api/tasks?page=${page}&sort=${sort}&order=${order}`)
			if (!res.ok) return rejectWithValue('failed_to_fetch')
			const data = (await res.json()) as PaginatedResult
			return data
		} catch (e) {
			return rejectWithValue('network_error')
		}
	}
)

export const createTaskThunk = createAsyncThunk<Task, { username: string; email: string; text: string }>(
	'tasks/create',
	async (payload, { rejectWithValue }) => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/tasks`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
			if (!res.ok) return rejectWithValue('failed_to_create')
			const created = (await res.json()) as Task
			return created
		} catch (e) {
			return rejectWithValue('network_error')
		}
	}
)

export const updateTaskThunk = createAsyncThunk<
	Task,
	{ id: number; changes: { text?: string; completed?: boolean } },
	{ state: RootState }
>(
	'tasks/update',
	async ({ id, changes }, { getState, rejectWithValue }) => {
		try {
			const state = getState()
			const token: string | null = state.auth?.token ?? null
			const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(changes),
			})
			if (!res.ok) return rejectWithValue('failed_to_update')
			const updated = (await res.json()) as Task
			return updated
		} catch (e) {
			return rejectWithValue('network_error')
		}
	}
)

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setPage(state, action: PayloadAction<number>) {
			state.page = action.payload
		},
		setSort(state, action: PayloadAction<{ sort: SortField; order: SortOrder }>) {
			state.sort = action.payload.sort
			state.order = action.payload.order
			state.page = 1
		},
		addTaskLocal(state, action: PayloadAction<Task>) {
			state.items.unshift(action.payload)
		},
		updateTaskLocal(state, action: PayloadAction<Task>) {
			const idx = state.items.findIndex(t => t.id === action.payload.id)
			if (idx !== -1) state.items[idx] = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasks.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchTasks.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.items = action.payload.items
				state.total = action.payload.total
				state.page = action.payload.page
				state.pages = action.payload.pages
			})
			.addCase(fetchTasks.rejected, (state, action) => {
				state.status = 'failed'
				state.error = (action.payload as string) || 'failed_to_fetch'
			})
			.addCase(createTaskThunk.fulfilled, (state, action) => {
				if (state.items.length < 3 && state.page === state.pages) {
					state.items.push(action.payload)
					state.total += 1
				}
			})
			.addCase(updateTaskThunk.fulfilled, (state, action) => {
				state.items = state.items.map((t) => (t.id === action.payload.id ? action.payload : t))
			})
	},
})

export const { setPage, setSort, addTaskLocal, updateTaskLocal } = tasksSlice.actions
export default tasksSlice.reducer 