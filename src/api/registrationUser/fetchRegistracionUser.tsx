import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserRegistracion } from '../../redux/slice/registracionUserSlice';

const url = import.meta.env.VITE_API_BASE_URL;

const fetchRegistracionUser = createAsyncThunk<
  UserRegistracion,
  {
    username: string;
    email: string;
    password: string;
  },
  {
    rejectValue: { errors: { username?: string; email?: string } };
  }
>(
  'registracion/fetchUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            email,
            password,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Возвращаем ошибку в формате, который ожидает компонент
        return rejectWithValue({ errors: errorData.errors });
      }

      const data = await response.json();

      return data.user;
    } catch (error) {
      // Возвращаем общую ошибку, если что-то пошло не так
      return rejectWithValue({
        errors: {
          username: 'Неверное имя пользователя.',
          email: 'Неправильный адрес электронной почты.',
        },
      });
    }
  },
);

export default fetchRegistracionUser;
