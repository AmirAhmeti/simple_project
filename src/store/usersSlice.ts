import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
}

export interface Company { name: string }

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  website?: string
  address?: Address
  company?: Company
}

export interface UsersState {
  items: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: UsersState = {
  items: [],
  status: 'idle'
}

export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
  return res.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: {
      reducer(state, action: PayloadAction<User>) {
        state.items.unshift(action.payload)
      },
      prepare(user: Omit<User, 'id'>) {
        const id = Number(nanoid().replace(/\D/g, '').slice(0, 6) || Date.now())
        return { payload: { id, ...user } as User }
      }
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.items.findIndex(u => u.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.items = state.items.filter(u => u.id !== action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer


