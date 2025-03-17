import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const url = import.meta.env.VITE_API_BASE_URL;

// Новый интерфейс для запроса пользователя
interface UserUpdateRequest {
  username: string;
  email: string;
  image?: string;
  token?: string;
}

// Указываем типы для аргумента и возвращаемого значения
const fetchUpdateUser = createAsyncThunk<
  UserUpdateRequest,
  {
    username?: string;
    email?: string;
    image?: string;
    token?: string;
  },
  {
    rejectValue: { errors: { username?: string; email?: string } };
  }
>(
  'update/fetchUser',
  async ({ username, email, image }, { rejectWithValue }) => {
    // Получение токена из куки
    const token = Cookies.get('auth_token');

    // Проверка наличия токена перед выполнением запроса
    if (!token) {
      return rejectWithValue({
        errors: { username: 'Authorization token is missing' },
      });
    }

    try {
      const response = await fetch(`${url}user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user: {
            username,
            email,
            image,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({ errors: errorData.errors });
      }

      const data = await response.json();

      return data.user;
    } catch (error) {
      return rejectWithValue({
        errors: {
          username: 'Неверное имя пользователя.',
          email: 'Неправильный адрес электронной почты.',
        },
      });
    }
  },
);

export default fetchUpdateUser;
