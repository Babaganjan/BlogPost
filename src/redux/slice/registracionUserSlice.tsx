import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import fetchRegistracionUser from '../../api/registrationUser/fetchRegistracionUser';
import fetchLoggenUser from '../../api/loggenUser/fetchLoggenUser';
import fetchUpdateUser from '../../api/updateUser/fetchUpdateUser';
import { RootState } from '../store/store';

// Интерфейс для данных пользователя
export interface UserRegistracion {
  username: string;
  email: string;
  image?: string;
  token?: string;
}

// Интерфейс для состояния пользователя
interface UserState {
  isLoggedIn: boolean;
  loading: boolean;
  errors: { username?: string; email?: string; root?: string };
  user: UserRegistracion | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  loading: false,
  errors: {},
  user: null,
};

const registracionUserSlice = createSlice({
  name: 'registracion',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка регистрации
      .addCase(fetchRegistracionUser.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(fetchRegistracionUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload || null;

        // Сохраняем токен в cookies
        if (action.payload.token) {
          Cookies.set('auth_token', action.payload.token, {
            secure: true,
            sameSite: 'strict',
            expires: 7,
          });
        }

        // Сохраняем пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
        state.errors = {};
      })
      .addCase(fetchRegistracionUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Если есть payload, сохраняем ошибки из него
          state.errors = action.payload.errors;
        } else {
          // Если payload отсутствует, сохраняем общую ошибку
          state.errors = {
            root: action.error.message || 'Failed to fetch user data',
          };
        }
      })

      // Обработка авторизации
      .addCase(fetchLoggenUser.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(fetchLoggenUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload || null;
        if (action.payload.token) {
          Cookies.set('auth_token', action.payload.token, {
            secure: true,
            sameSite: 'strict',
            expires: 7,
          });
        }

        localStorage.setItem('user', JSON.stringify(state.user));
        state.errors = {};
      })
      .addCase(fetchLoggenUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Если есть payload, сохраняем ошибки из него
          state.errors = action.payload.errors;
        } else {
          // Если payload отсутствует, сохраняем общую ошибку
          state.errors = {
            root: action.error.message || 'Failed to fetch user data',
          };
        }
      })
      // Обработка обновления профиля
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;

        state.user = action.payload || null;

        if (action.payload.token) {
          Cookies.set('auth_token', action.payload.token, {
            secure: true,
            sameSite: 'strict',
            expires: 7,
          });
        }

        localStorage.setItem('user', JSON.stringify(state.user));
        state.errors = {};
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.errors = {
          root: action.error.message || 'Failed to update user data',
        };
      });
  },
});

export const isLoggedInSelector = (state: RootState) => state.registracion;

export const { setIsLoggedIn, setUser } = registracionUserSlice.actions;

export default registracionUserSlice.reducer;
