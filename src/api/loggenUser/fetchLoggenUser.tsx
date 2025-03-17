import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserRegistracion } from '../../redux/slice/registracionUserSlice';

const url = import.meta.env.VITE_API_BASE_URL;

const fetchLoggenUser = createAsyncThunk<
  UserRegistracion,
  {
    email: string;
    password: string;
  },
  {
    rejectValue: { errors: { email?: string; password?: string } };
  }
>('login/fetchUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${url}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
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
        email: 'Неправильный адрес электронной почты.',
        password: 'Неверный пароль.',
      },
    });
  }
});

export default fetchLoggenUser;
